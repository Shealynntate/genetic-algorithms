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
  type SagaReturnType,
  type CallEffect,
  type GetContextEffect,
  type PutEffect,
  type ForkEffect
} from 'redux-saga/effects'
import { type SimulationState, type OrganismRecord, type SetSimulationParametersAction, type EndSimulationsAction, type RestoreSimulationAction, type ClearCurrentSimulationAction } from './types'
import { minResultsThreshold, saveThresholds } from '../constants/constants'
import {
  addGalleryEntry,
  addImageToDatabase,
  insertResultsForCurrentSimulation,
  deleteCurrentSimulation,
  getCurrentImages,
  getCurrentSimulation,
  setCurrentSimulation,
  updateCurrentSimulation,
  getNextSimulationToRun
} from '../database/api'
import { approxEqual, setSigFigs } from '../utils/utils'
import { genomeToPhenotype, createGif } from '../utils/imageUtils'
import { isRunningSelector } from '../navigation/hooks'
import { setSimulationParameters } from '../parameters/parametersSlice'
import {
  addGenStats,
  setGlobalBest,
  updateCurrentGen,
  clearCurrentSimulation,
  restorePopulation
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
import populationService, { type PopulationServiceType } from '../population/population-context'
import { type Simulation } from '../database/types'
import type PopulationModel from '../population/populationModel'
import { type GenerationStats } from '../population/types'

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

// function * typedTake<T> (pattern: string): Generator<TakeEffect, T, T> {
//   const action: T = yield take(pattern)

//   return action
// }

type RunSimulationsSagaReturnType =
  Generator<Promise<PopulationModel>
  | Promise<Simulation | undefined>
  | Promise<number>
  | PutEffect<SetSimulationParametersAction>
  | CallEffect<any>
  | PutEffect<EndSimulationsAction>, void, any>

const createGalleryEntry = async (totalGen: number, globalBest: OrganismRecord): Promise<void> => {
  const simulation = await getCurrentSimulation()
  if (simulation == null) {
    console.error('[createGalleryEntry] No current simulation found')
    return
  }
  const { id, name, parameters } = simulation
  const history = await getCurrentImages()
  const imageData = history.map((entry) => entry.imageData)
  const phenotype = genomeToPhenotype(globalBest.organism.genome)
  // Show the last image 4 times as long in the gif
  const result = [...imageData, phenotype, phenotype, phenotype, phenotype]
  const gif = await createGif(result as ImageData[])
  const galleryData = {
    name,
    gif,
    globalBest,
    parameters,
    totalGen
  }
  const json = JSON.stringify(galleryData)
  if (id == null) {
    throw new Error('[createGalleryEntry] No simulation id found')
  }
  await addGalleryEntry(id, json)
}

// Saga Functions
// --------------------------------------------------
function * restorePopulationSaga (action: RestoreSimulationAction): Generator<Promise<PopulationModel>, void, unknown> {
  const simulation = action.payload
  const { population, parameters } = simulation
  if (population == null) {
    throw new Error('[restorePopulationSaga] No population found')
  }
  yield populationService.restore(
    population,
    parameters.population.minGenomeSize,
    parameters.population.maxGenomeSize
  )
}

function * resetSimulationsSaga (): Generator<GetContextEffect | PutEffect<ClearCurrentSimulationAction>, void, PopulationServiceType> {
  const populationService = yield * typedGetContext<PopulationServiceType>('population')
  yield put(clearCurrentSimulation())
  populationService.reset()
}

function * completeSimulationRunSaga (): Generator<SelectEffect | GetContextEffect | Promise<number> | Promise<void> | CallEffect<void>, void, SimulationState & PopulationServiceType> {
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

function * runSimulationSaga (population: PopulationModel): any {
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
    const runGenResult: GenerationStats = yield population.runGeneration()
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
    yield put(updateCurrentGen({ currentBest: { organism, genId: runGenResult.gen }, runGenResult }))
    // --------------------------------------------------
    // Update the list of maxFitness scores
    const { globalBest, runningStatsRecord } = yield * typedSelect((state) => state.simulation)
    const isSuccess = hasReachedTarget(globalBest, stopCriteria.targetFitness)
    const isStopping = isSuccess || runGenResult.gen >= stopCriteria.maxGenerations
    // Add the current stats to the record if they meet the requirements
    const currentMax = setSigFigs(runGenResult.maxFitness, 3)
    if (currentMax >= minResultsThreshold) {
      let latestThreshold = 0
      if (runningStatsRecord.length > 0) {
        latestThreshold = runningStatsRecord[runningStatsRecord.length - 1].threshold
      }
      // If the results are a new GlobalBest or are different enough from the previously
      // recorded value, add them to the record
      if (currentMax !== latestThreshold || runGenResult.isGlobalBest || isStopping) {
        yield put(addGenStats({ threshold: currentMax, runGenResult }))
        yield call(insertResultsForCurrentSimulation, runningStatsRecord)
      }
    }
    // Check if the simulation is over
    if (isStopping) {
      yield call(completeSimulationRunSaga)
      return true
    }
  }
}

function * runSimulationsSaga (): RunSimulationsSagaReturnType {
  while (true) {
    const next: Simulation | undefined = yield getNextSimulationToRun()
    if (next == null) break

    const population: PopulationModel = yield populationService.create({
      size: next.parameters.population.size,
      minGenomeSize: next.parameters.population.minGenomeSize,
      maxGenomeSize: next.parameters.population.maxGenomeSize,
      minPoints: next.parameters.population.minPoints,
      maxPoints: next.parameters.population.maxPoints,
      target: next.parameters.population.target,
      mutation: next.parameters.population.mutation,
      crossover: next.parameters.population.crossover,
      selection: next.parameters.population.selection
    })
    yield updateCurrentSimulation({ status: 'running', population: population.serialize() })
    yield put(setSimulationParameters(next.parameters))
    const doContinue: boolean = (yield * typedCall(runSimulationSaga, population)) as boolean
    // If user reset simulations, exit early and don't mark them complete
    if (!doContinue) return
  }
  // All simulations have completed, signal that the run is over
  yield setCurrentSimulation()
  yield put(endSimulations())
}

function * simulationSaga (): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(runSimulations, runSimulationsSaga)
  yield takeEvery(restorePopulation, restorePopulationSaga)
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
