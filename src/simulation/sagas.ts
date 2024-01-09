import { omit } from 'lodash'
import {
  type SelectEffect,
  call,
  delay,
  getContext,
  put,
  race,
  select,
  take,
  takeEvery,
  type SagaReturnType,
  type CallEffect,
  type GetContextEffect,
  type PutEffect
} from 'redux-saga/effects'
import { type OrganismRecord } from './types'
import { minResultsThreshold, saveThresholds } from '../constants/constants'
import {
  addGalleryEntry,
  addImageToDatabase,
  insertResultsForCurrentSimulation,
  deleteCurrentSimulation,
  getCurrentImages,
  getCurrentSimulation,
  runNextPendingSimulation,
  setCurrentSimulation,
  updateCurrentSimulation,
  getSimulationByStatus
} from '../database/api'
import { approxEqual, setSigFigs } from '../utils/utils'
import { chromosomesToPhenotype, createGif, createImageData } from '../utils/imageUtils'
import { isRunningSelector } from '../navigation/hooks'
import { setSimulationParameters } from '../parameters/parametersSlice'
import {
  addGenStats,
  setGlobalBest,
  updateCurrentGen,
  RESTORE_POPULATION,
  clearCurrentSimulation
} from './simulationSlice'
import {
  deleteRunningSimulation,
  endSimulationEarly,
  endSimulations,
  removeGraphEntry,
  resumeSimulations,
  runSimulations
} from '../navigation/navigationSlice'
import { type RootState } from '../store'
import { type PopulationServiceType } from '../population/population-context'
import { Simulation } from '../database/types'

function * typedSelect<T> (selector: (state: RootState) => T): Generator<SelectEffect, T, T> {
  const slice: T = yield select(selector)

  return slice
}

function * typedCall<Fn extends (...args: any[]) => any> (
  fn: Fn,
  ...args: Parameters<Fn>
): Generator<CallEffect<SagaReturnType<Fn>>, SagaReturnType<Fn>, SagaReturnType<Fn>> {
  const value: SagaReturnType<typeof fn> = yield call(fn, ...args)

  return value
}

function * typedGetContext<T> (key: string): Generator<GetContextEffect, T, T> {
  const value: T = yield getContext(key)

  return value
}

// Saga Functions
// --------------------------------------------------
function * restorePopulationSaga ({ payload: populationData }) {
  const target = yield * typedSelect((state: RootState) => state.parameters.target)
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  const { data } = yield createImageData(target)
  yield populationService.restore({ target: data, ...populationData })
}

interface ClearCurrentSimulationAction {
  payload: undefined
  type: 'simulation/clearCurrentSimulation'
}

function * resetSimulationsSaga (): Generator<GetContextEffect | PutEffect<ClearCurrentSimulationAction>, void, PopulationServiceType> {
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  yield put(clearCurrentSimulation())
  populationService.reset()
}

function * createGalleryEntrySaga ({ totalGen, globalBest }) {
  const { id, name, parameters } = yield getCurrentSimulation()
  const history: Image[] = yield getCurrentImages()
  const imageData = history.map((entry) => entry.imageData)
  const { chromosomes } = globalBest.organism.genome
  const phenotype = chromosomesToPhenotype(chromosomes)
  // Show the last image 4 times as long in the gif
  const result = [...imageData, phenotype, phenotype, phenotype, phenotype]
  const gif = yield createGif(result)
  const galleryData = {
    name,
    gif,
    globalBest,
    parameters,
    totalGen
  }
  const json = JSON.stringify(galleryData)
  yield addGalleryEntry(id, json)
}

function * completeSimulationRunSaga () {
  const globalBest = yield * typedSelect((state) => state.simulation.globalBest)
  const currentBest = yield * typedSelect((state) => state.simulation.currentBest)
  const currentStats = yield * typedSelect((state) => state.simulation.currentGenStats)
  const results = yield * typedSelect((state) => state.simulation.runningStatsRecord)
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  const population = populationService.getPopulation()
  const fitness = globalBest?.organism.fitness ?? 0
  const currentMax = Math.trunc(fitness * 1000) / 1000
  // Create a Gallery Entry for the run
  yield call(createGalleryEntrySaga, {
    totalGen: currentBest?.gen ?? 0,
    globalBest
  })
  // Stop the simulation and add the results to database
  const lastGenResults = { threshold: currentMax, stats: currentStats }
  yield put(addGenStats(lastGenResults))
  yield updateCurrentSimulation({
    population: population.serialize(),
    status: 'complete'
  })
  yield insertResultsForCurrentSimulation([...results, lastGenResults])
  yield call(resetSimulationsSaga)
}

function * generationResultsCheckSaga ({
  stopCriteria,
  currentBest,
  stats
}) {
  const globalBest = yield * typedSelect((state) => state.simulation.globalBest)
  const statsRecord = yield * typedSelect((state) => state.simulation.runningStatsRecord)

  const { targetFitness, maxGenerations } = stopCriteria
  const isSuccess = hasReachedTarget(globalBest, targetFitness)
  const isStopping = isSuccess || currentBest.genId >= maxGenerations

  // Add the current stats to the record if they meet the requirements
  const currentMax = setSigFigs(stats.maxFitness, 3)
  if (currentMax >= minResultsThreshold) {
    let latestThreshold = 0
    if (statsRecord.length > 0) {
      latestThreshold = statsRecord[statsRecord.length - 1].threshold
    }
    // If the results are a new GlobalBest or are different enough from the previously
    // recorded value, add them to the record
    if (currentMax !== latestThreshold || stats.isGlobalBest) {
      yield put(addGenStats({ threshold: currentMax, stats }))
    }
  }

  // Check if the simulation is over
  if (isStopping) {
    yield call(completeSimulationRunSaga)
    return true
  }
  return false
}

function * runSimulationSaga (parameters: Simulation) {
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  let population = populationService.getPopulation()

  // Initialize the population if we're starting a new run
  if (population == null) {
    const {
      crossover,
      mutation,
      selection,
      population: {
        target,
        size,
        minPolygons,
        maxPolygons,
        minPoints,
        maxPoints
      }
    } = parameters
    const { data } = yield createImageData(target)

    population = yield populationService.create({
      size,
      minGenomeSize: minPolygons,
      maxGenomeSize: maxPolygons,
      minPoints,
      maxPoints,
      target: data,
      mutation,
      crossover,
      selection
    })
  }

  yield updateCurrentSimulation({
    population: population.serialize()
  })
  yield put(setSimulationParameters(parameters))
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
      if (endSim) {
        // End the simulation early, saving the run as if it completed normally
        yield call(completeSimulationRunSaga)
        return true
      }
      if (deleteSim) {
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
    const { maxFitOrganism, ...stats } = yield population.runGeneration()
    const organism = omit(maxFitOrganism, ['phenotype'])

    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, maxFitOrganism)
      yield delay(10)
    }

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }))
    }

    // Update the list of maxFitness scores
    yield put(updateCurrentGen({
      currentBest: { organism, genId: stats.genId },
      stats
    }))

    // Update the list of maxFitness scores
    const result = yield * typedCall(generationResultsCheckSaga, {
      currentBest: { organism, gen: stats.genId },
      stats,
      stopCriteria: parameters.stopCriteria
    })
    // The experiment has met one of the stop criteria, signal that it's complete
    if (result) return true
  }
}

function * runSimulationsSaga () {
  while (true) {
    const pendingSimulation: Simulation | undefined = yield getSimulationByStatus('pending')
    if (pendingSimulation == null) break

    yield setCurrentSimulation(pendingSimulation.id)
    yield updateCurrentSimulation({ status: 'running' })
    const next: boolean = yield * typedCall(runSimulationSaga, pendingSimulation)
    // If user reset simulations, exit early and don't mark them complete
    if (!next) return
  }
  // All simulations have completed, signal that the run is over
  yield setCurrentSimulation()
  yield put(endSimulations())
}

function * simulationSaga () {
  yield takeEvery(runSimulations, runSimulationsSaga)
  yield takeEvery(RESTORE_POPULATION, restorePopulationSaga)
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
