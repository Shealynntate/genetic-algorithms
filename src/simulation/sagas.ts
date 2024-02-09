/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  call,
  delay,
  getContext,
  put,
  race,
  select,
  take,
  takeEvery,
  type SelectEffect,
  // type CallEffect,
  type GetContextEffect,
  type ForkEffect
} from 'redux-saga/effects'
import { type SimulationState, type OrganismRecord, type StartSimulationAction } from './types'
import { minResultsThreshold, saveThresholds } from '../constants/constants'
import {
  addGifEntry,
  addImageToDatabase,
  deleteCurrentSimulation,
  getCurrentImages,
  getCurrentSimulation,
  updateCurrentSimulation,
  addResultsForCurrentSimulation,
  setCurrentSimulation
} from '../database/api'
import { approxEqual, setSigFigs } from '../utils/utils'
import { genomeToPhenotype, createGif } from '../utils/imageUtils'
import { isRunningSelector } from '../navigation/hooks'
import { setSimulationParameters } from '../parameters/parametersSlice'
import { setGlobalBest, updateCurrentGen, clearCurrentSimulation, setLastThreshold } from './simulationSlice'
import {
  deleteRunningSimulation,
  endSimulationEarly,
  endSimulations,
  removeGraphEntry,
  resumeSimulations
} from '../navigation/navigationSlice'
import { type RootState } from '../store'
import populationService, { type PopulationServiceType } from '../population/population-context'
import type PopulationModel from '../population/populationModel'
import { type GenerationStatsRecord, type GenerationStats } from '../population/types'
// import { type Simulation } from '../database/types'

function * typedSelect<T> (selector: (state: RootState) => T): Generator<SelectEffect, T, T> {
  const slice: T = yield select(selector)

  return slice
}

// function * typedCall<Fn extends (...args: any[]) => any> (
//   fn: Fn,
//   ...args: Parameters<Fn>
// ): Generator<CallEffect<SagaReturnType<Fn>>, SagaReturnType<Fn>, SagaReturnType<Fn>> {
//   const value: SagaReturnType<typeof fn> = yield call(fn, ...args)

//   return value
// }

function * typedGetContext<T> (key: string): Generator<GetContextEffect, T, T> {
  const value: T = yield getContext(key)

  return value
}

// function * typedTake<T> (pattern: string): Generator<TakeEffect, T, T> {
//   const action: T = yield take(pattern)

//   return action
// }

// type RunSimulationsSagaReturnType =
//   Generator<SelectEffect
//   | Promise<PopulationModel>
//   | Promise<Simulation | undefined>
//   | Promise<number>
//   | PutEffect<SetSimulationParametersAction>
//   | CallEffect<any>
//   | PutEffect<EndSimulationsAction>, void, any>

const createGalleryEntry = async (totalGen: number, globalBest: OrganismRecord): Promise<void> => {
  const simulation = await getCurrentSimulation()
  if (simulation == null) {
    console.error('[createGalleryEntry] No current simulation found')
    return
  }
  const { id } = simulation
  const history = await getCurrentImages()
  const imageData = history.map((entry) => entry.imageData)
  const phenotype = genomeToPhenotype(globalBest.organism.genome)
  // Show the last image 4 times as long in the gif
  const result = [...imageData, phenotype, phenotype, phenotype, phenotype]
  const gif = await createGif(result as ImageData[])
  if (id == null) {
    throw new Error('[createGalleryEntry] No simulation id found')
  }
  await addGifEntry(id, gif)
}

// Generator<GetContextEffect | PutEffect<ClearCurrentSimulationAction>, void, PopulationServiceType> | Promise<Simulation | undefined>
// Saga Functions
// --------------------------------------------------
function * resetSimulationsSaga (): any {
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  yield put(clearCurrentSimulation())
  yield setCurrentSimulation()
  yield put(endSimulations())
  populationService.reset()
}

function * completeSimulationRunSaga (): any { // } Generator<SelectEffect | GetContextEffect | Promise<number> | Promise<void> | CallEffect<void>, void, SimulationState & PopulationServiceType> {
  const { globalBest, currentBest } = yield * typedSelect((state) => state.simulation)
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  const population = populationService.getPopulation()
  // Create a Gallery Entry for the run
  if (globalBest != null) {
    yield createGalleryEntry(currentBest?.gen ?? 0, globalBest)
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

function * runSimulationSaga (action: StartSimulationAction): any {
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
  yield updateCurrentSimulation({ status: 'running', population: population.serialize() })
  yield put(setSimulationParameters(parameters))

  const { stopCriteria } = yield * typedSelect((state) => state.parameters)
  // Run the experiment in a loop until one of the stop criteria is met
  while (true) {
    const isRunning = yield * typedSelect(isRunningSelector)
    // If the experiment has been paused, wait until a resume or endEarly action has been fired
    if (!isRunning) {
      const { endSim, deleteSim } = yield race({
        resume: take(resumeSimulations),
        endSim: take(endSimulationEarly),
        deleteSim: take(deleteRunningSimulation)
      })
      if (endSim != null) {
        // End the simulation early, saving the run as if it completed normally
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
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism())
      yield delay(10)
    }
    // First run the next generation of the simulation
    console.time('runGeneration')
    const runGenResult: GenerationStats = yield population.runGeneration()
    console.timeEnd('runGeneration')
    const organism = runGenResult.maxFitOrganism
    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, runGenResult.maxFitOrganism)
      yield delay(10)
    }
    // Check if the latest generation's most fit organism can beat our global best
    if (runGenResult.isGlobalBest) {
      yield put(setGlobalBest({ gen: runGenResult.gen, organism }))
    }
    // Update the list of maxFitness scores
    const currentMax = setSigFigs(runGenResult.maxFitness, 3)
    const genStats: GenerationStatsRecord = { threshold: currentMax, stats: runGenResult }
    yield put(updateCurrentGen({ stats: genStats, currentBest: organism }))
    // --------------------------------------------------
    // Update the list of maxFitness scores
    const { globalBest, lastThreshold } = yield * typedSelect((state) => state.simulation)
    const isSuccess = hasReachedTarget(globalBest, stopCriteria.targetFitness)
    const isStopping = isSuccess || runGenResult.gen >= stopCriteria.maxGenerations
    // Add the current stats to the record if they meet the requirements
    if (population.genId === 1 || currentMax >= minResultsThreshold) {
      // If the results are a new GlobalBest or are different enough from the previously
      // recorded value, add them to the record
      if (population.genId === 1 || currentMax !== lastThreshold || runGenResult.isGlobalBest || isStopping) {
        yield call(addResultsForCurrentSimulation, genStats)
        yield put(setLastThreshold(currentMax))
      }
    }
    // Check if the simulation is over
    if (isStopping) {
      yield call(completeSimulationRunSaga)
      return true
    }
  }
}

function * simulationSaga (): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery('navigation/runSimulation', runSimulationSaga)
}

// Private Helper Functions
// --------------------------------------------------
const shouldSaveGenImage = (genId: number): boolean => {
  for (let i = 0; i < saveThresholds.length; ++i) {
    if (genId <= saveThresholds[i].threshold) {
      const mod = saveThresholds[i].mod

      return (genId % mod) === 0
    }
  }
  return false
}

const hasReachedTarget = (globalBest: OrganismRecord | undefined, target: number): boolean => {
  if (globalBest == null) return false

  const { fitness } = globalBest.organism

  return fitness > target || approxEqual(fitness, target)
}

export default simulationSaga
