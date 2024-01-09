import { omit } from 'lodash'
import { call, delay, getContext, put, race, select, take, takeEvery } from 'redux-saga/effects'
import { type GlobalBest } from './types'
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
  updateCurrentSimulation
} from '../database/api'
import { approxEqual, setSigFigs } from '../utils/utils'
import { chromosomesToPhenotype, createGif, createImageData } from '../utils/imageUtils'
import { isRunningSelector } from '../ux/hooks'
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
} from '../ux/uxSlice'

// Saga Functions
// --------------------------------------------------
function * restorePopulationSaga ({ payload: populationData }) {
  const target: string = yield select((state) => state.parameters.target)
  const populationService = yield getContext('population')
  const { data } = yield createImageData(target)
  yield populationService.restore({ target: data, ...populationData })
}

function * resetSimulationsSaga () {
  const populationService = yield getContext('population')
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
  const globalBest = yield select((state) => state.simulation.globalBest)
  const currentBest = yield select((state) => state.simulation.currentBest)
  const currentStats = yield select((state) => state.simulation.currentGenStats)
  const results = yield select((state) => state.simulation.runningStatsRecord)
  const { population } = yield getContext('population')
  const currentMax = Math.trunc(currentBest.organism.fitness * 1000) / 1000
  // Create a Gallery Entry for the run
  yield call(createGalleryEntrySaga, {
    totalGen: currentBest.genId,
    globalBest
  })
  // Stop the simulation and add the results to database
  const lastGenResults = { threshold: currentMax, stats: currentStats }
  yield put(addGenStats(lastGenResults))
  yield updateCurrentSimulation({
    population: population.serialize(),
    status: SimulationStatus.COMPLETE
  })
  yield insertResultsForCurrentSimulation([...results, lastGenResults])
  yield call(resetSimulationsSaga)
}

function * generationResultsCheckSaga ({
  stopCriteria,
  currentBest,
  stats
}) {
  const globalBest = yield select((state) => state.simulation.globalBest)
  const statsRecord = yield select((state) => state.simulation.runningStatsRecord)

  const { targetFitness, maxGenerations } = stopCriteria
  const isSuccess = hasReachedTarget(globalBest, targetFitness)
  const isStopping = isSuccess || currentBest.genId >= maxGenerations

  // Add the current stats to the record if they meet the requirements
  const currentMax = setSigFigs(stats.maxFitness, 3)
  if (currentMax >= minResultsThreshold) {
    let latestThreshold = 0
    if (statsRecord.length) {
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

function * runSimulationSaga ({ parameters }) {
  const populationService = yield getContext('population')
  let population = populationService.getPopulation()

  // Initialize the population if we're starting a new run
  if (!population) {
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
    // If the experiment has been paused, wait until a resume or endEarly action has been fired
    if (!(yield select(isRunningSelector))) {
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
    const result = yield call(generationResultsCheckSaga, {
      currentBest: { organism, genId: stats.genId },
      stats,
      stopCriteria: parameters.stopCriteria
    })
    // The experiment has met one of the stop criteria, signal that it's complete
    if (result) return true
  }
}

function * runSimulationsSaga () {
  let pendingSimulation = yield runNextPendingSimulation()

  while (pendingSimulation) {
    const doContinue = yield call(runSimulationSaga, pendingSimulation)
    // If user reset simulations, exit early and don't mark them complete
    if (!doContinue) return

    pendingSimulation = yield runNextPendingSimulation()
  }

  yield setCurrentSimulation(null)
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

const hasReachedTarget = (globalBest: GlobalBest | undefined, target: number): boolean => {
  if (globalBest == null) return false

  const { fitness } = globalBest.organism

  return fitness > target || approxEqual(fitness, target)
}

export default simulationSaga
