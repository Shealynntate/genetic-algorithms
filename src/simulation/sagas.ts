import {
  call,
  delay,
  put,
  race,
  take,
  takeEvery,
  type ForkEffect
} from 'redux-saga/effects'
import { type StartSimulationAction } from './types'
import {
  addImageToDatabase,
  deleteCurrentSimulation,
  getCurrentSimulation,
  updateCurrentSimulation,
  addResultsForCurrentSimulation,
  setCurrentSimulation
} from '../database/api'
import { setSigFigs } from '../common/utils'
import { isRunningSelector } from '../navigation/hooks'
import { setSimulationParameters } from '../parameters/parametersSlice'
import {
  setGlobalBest,
  clearCurrentSimulation,
  setLastThreshold,
  setCurrentGenStats
} from './simulationSlice'
import {
  deleteRunningSimulation,
  endSimulationEarly,
  endSimulations,
  removeGraphEntry,
  resumeSimulations
} from '../navigation/navigationSlice'
import populationService, {
  type PopulationServiceType
} from '../population/population-context'
import type PopulationModel from '../population/populationModel'
import {
  type GenerationStatsRecord,
  type GenerationStats
} from '../population/types'
import {
  createGalleryEntry,
  hasReachedTarget,
  shouldSaveGenImage,
  typedGetContext,
  typedSelect
} from './utils'
import { recordSigFigs } from './config'

// Saga Functions
// --------------------------------------------------
function* resetSimulationsSaga(): any {
  const populationService =
    yield* typedGetContext<PopulationServiceType>('population')
  yield put(clearCurrentSimulation())
  yield setCurrentSimulation()
  yield put(endSimulations())
  populationService.reset()
}

function* completeSimulationRunSaga(): any {
  const { globalBest } = yield* typedSelect((state) => state.simulation)
  const populationService =
    yield* typedGetContext<PopulationServiceType>('population')
  const population = populationService.getPopulation()
  // Create a Gallery Entry for the run
  if (globalBest != null) {
    yield createGalleryEntry(globalBest)
  } else {
    console.error('[completeSimulationRunSaga] No globalBest found')
  }
  // Stop the simulation and add the results to database
  yield updateCurrentSimulation({
    population: population?.serialize(),
    status: 'complete'
  })
  yield call(resetSimulationsSaga)
}

function* runSimulationSaga(action: StartSimulationAction): any {
  const { id, parameters } = action.payload
  populationService.reset()
  const population: PopulationModel = yield populationService.create({
    size: parameters.population.size,
    minGenomeSize: parameters.population.minGenomeSize,
    maxGenomeSize: parameters.population.maxGenomeSize,
    minPoints: parameters.population.minPoints,
    maxPoints: parameters.population.maxPoints,
    target: parameters.population.target,
    mutation: parameters.population.mutation,
    crossover: parameters.population.crossover,
    selection: parameters.population.selection
  })
  yield setCurrentSimulation(id)
  yield updateCurrentSimulation({
    status: 'running',
    population: population.serialize()
  })
  yield put(setSimulationParameters(parameters))

  const stopCriteria = yield* typedSelect(
    (state) => state.parameters.stopCriteria
  )
  let currentGenStats: GenerationStatsRecord | undefined
  // Run the experiment in a loop until one of the stop criteria is met
  while (true) {
    const isRunning = yield* typedSelect(isRunningSelector)
    // If the experiment has been paused, wait until a resume or endEarly action has been fired
    if (!isRunning) {
      const { endSim, deleteSim } = yield race({
        resume: take(resumeSimulations),
        endSim: take(endSimulationEarly),
        deleteSim: take(deleteRunningSimulation)
      })
      if (endSim != null) {
        // End the simulation early, saving the run as if it completed normally
        if (currentGenStats != null) {
          yield call(addResultsForCurrentSimulation, currentGenStats)
        }
        yield call(completeSimulationRunSaga)
        return true
      }
      if (deleteSim != null) {
        // Clear graph state if current simulation was being tracked
        const { id } = yield getCurrentSimulation()
        yield put(removeGraphEntry(id))
        // Delete the run from the database and move on to the next one
        yield call(deleteCurrentSimulation)
        yield call(resetSimulationsSaga)
        return true
      }
    }

    if (population.genId === 0) {
      yield call(
        addImageToDatabase,
        population.genId,
        population.maxFitOrganism()
      )
      yield delay(10)
    }
    // First run the next generation of the simulation
    const runGenResult: GenerationStats = yield population.runGeneration()
    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(
        addImageToDatabase,
        population.genId,
        runGenResult.maxFitOrganism
      )
      yield delay(10)
    }
    // Check if the latest generation's most fit organism can beat our global best
    if (runGenResult.isGlobalBest) {
      yield put(
        setGlobalBest({
          gen: runGenResult.gen,
          organism: runGenResult.maxFitOrganism
        })
      )
    }
    // Record the current generation's stats in Redux
    const currentMax = setSigFigs(runGenResult.maxFitness, recordSigFigs)
    currentGenStats = { threshold: currentMax, stats: runGenResult }
    yield put(setCurrentGenStats(currentGenStats))
    // Check if the simulation has reached a stopping point
    const { globalBest, lastThreshold } = yield* typedSelect(
      (state) => state.simulation
    )
    const isSuccess = hasReachedTarget(globalBest, stopCriteria.targetFitness)
    const isStopping =
      isSuccess || runGenResult.gen >= stopCriteria.maxGenerations
    // If the results qualify for saving, add them to the database
    if (
      population.genId === 1 ||
      currentMax !== lastThreshold ||
      runGenResult.isGlobalBest ||
      isStopping
    ) {
      yield call(addResultsForCurrentSimulation, currentGenStats)
      yield put(setLastThreshold(currentMax))
    }
    // If the simulation is over, complete the run and exit the loop
    if (isStopping) {
      yield call(completeSimulationRunSaga)
      return true
    }
  }
}

function* simulationSaga(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery('navigation/runSimulation', runSimulationSaga)
}

export default simulationSaga
