import { omit } from 'lodash';
import {
  call,
  delay,
  getContext,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { minExperimentThreshold, SimulationStatus } from '../../constants';
import {
  addGalleryEntry,
  addImageToDatabase,
  deleteCurrentSimulation,
  getCurrentImages,
  getCurrentSimulation,
  getNextPendingSimulation,
  setCurrentSimulation,
  updateCurrentSimulation,
} from '../../globals/database';
import { approxEqual } from '../../globals/statsUtils';
import {
  chromosomesToPhenotype, createGif, createImageData, shouldSaveGenImage,
} from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import {
  addGenStats,
  setGlobalBest,
  updateCurrentGen,
  RESTORE_POPULATION,
} from './simulationSlice';
import {
  deleteRunningSimulation,
  endSimulationEarly,
  endSimulations,
  resumeSimulations,
  runSimulations,
} from '../ux/uxSlice';
import { setSimulationParameters } from '../parameters/parametersSlice';

let globalUpdateCount = 0;
let monitoredBest = 0;

function* restorePopulationSaga({ payload: populationData }) {
  const target = yield select((state) => state.parameters.target);
  const populationService = yield getContext('population');
  const { data } = yield createImageData(target);
  yield populationService.restore({ target: data, ...populationData });
}

const hasReachedTarget = (globalBest, target) => {
  if (!globalBest) return false;

  const { fitness } = globalBest.organism;
  return fitness > target || approxEqual(fitness, target);
};

function* resetSimulationsSaga() {
  const populationService = yield getContext('population');
  yield put(setGlobalBest());
  populationService.reset();
  globalUpdateCount = 0;
  monitoredBest = 0;
}

function* createGalleryEntrySaga({ totalGen, globalBest }) {
  const { name, parameters } = yield getCurrentSimulation();
  const history = yield getCurrentImages();
  const imageData = history.map((entry) => entry.imageData);
  const { chromosomes } = globalBest.organism.genome;
  const phenotype = chromosomesToPhenotype(chromosomes);
  // Show the last image 4 times as long in the gif
  const result = [...imageData, phenotype, phenotype, phenotype, phenotype];
  const gif = yield createGif(result);
  const galleryData = {
    name,
    gif,
    globalBest,
    parameters,
    totalGen,
  };
  const json = JSON.stringify(galleryData);
  yield addGalleryEntry(json);
}

function* completeSimulationRunSaga() {
  const globalBest = yield select((state) => state.simulation.globalBest);
  const currentBest = yield select((state) => state.simulation.currentBest);
  const currentStats = yield select((state) => state.simulation.currentGenStats);
  const results = yield select((state) => state.simulation.runningStatsRecord);
  const { population } = yield getContext('population');
  const currentMax = currentBest.organism.fitness;
  // Create a Gallery Entry for the run
  yield call(createGalleryEntrySaga, {
    totalGen: currentBest.genId,
    globalBest,
  });
  // Stop the simulation and add the results to database
  yield put(addGenStats({ threshold: currentMax, currentStats }));
  yield updateCurrentSimulation({
    population: population.serialize(),
    status: SimulationStatus.COMPLETE,
    results,
  });
  yield call(resetSimulationsSaga);
}

function* generationResultsCheckSaga({
  stopCriteria,
  currentBest,
  stats,
  maxFitOrganism,
}) {
  const globalBest = yield select((state) => state.simulation.globalBest);
  const statsRecord = yield select((state) => state.simulation.runningStatsRecord);

  const { targetFitness, maxGenerations } = stopCriteria;
  const isSuccess = hasReachedTarget(globalBest, targetFitness);
  const isStopping = isSuccess || currentBest.genId >= maxGenerations;

  // Store results if needed
  let latestThreshold = 0;
  if (statsRecord.length) {
    latestThreshold = statsRecord[statsRecord.length - 1].threshold;
  }
  const currentMax = Math.trunc(stats.maxFitness * 1000) / 1000;
  if (currentMax >= minExperimentThreshold && currentMax !== latestThreshold) {
    yield put(addGenStats({ threshold: currentMax, stats }));
  }

  // Temp code!!
  if (maxFitOrganism.fitness > monitoredBest) {
    monitoredBest = maxFitOrganism.fitness;
    globalUpdateCount = 0;
  } else {
    globalUpdateCount += 1;
  }

  // Check if the simulation is over
  if (isStopping) {
    yield call(completeSimulationRunSaga);
    return true;
  }
  return false;
}

function* runSimulationSaga({ parameters }) {
  const populationService = yield getContext('population');
  let population = populationService.getPopulation();

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
        maxPoints,
      },
    } = parameters;
    const { data } = yield createImageData(target);

    population = yield populationService.create({
      size,
      minGenomeSize: minPolygons,
      maxGenomeSize: maxPolygons,
      minPoints,
      maxPoints,
      target: data,
      mutation,
      crossover,
      selection,
    });
  }

  yield updateCurrentSimulation({
    status: SimulationStatus.RUNNING,
    population: population.serialize(),
  });
  yield put(setSimulationParameters({ parameters }));
  // Run the experiment in a loop until one of the stop criteria is met
  while (true) {
    // If the experiment has been paused, wait until a resume or endEarly action has been fired
    if (!(yield select(isRunningSelector))) {
      const { endSim, deleteSim } = yield race({
        resume: take(resumeSimulations),
        endSim: take(endSimulationEarly),
        deleteSim: take(deleteRunningSimulation),
      });
      if (endSim) {
        // End the simulation early, saving the run as if it completed normally
        yield call(completeSimulationRunSaga);
        return true;
      }
      if (deleteSim) {
        // Delete the run from the database and move on to the next one
        yield call(deleteCurrentSimulation);
        return true;
      }
    }

    if (population.genId === 0) {
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      yield delay(10);
    }

    // First run the next generation of the simulation
    const isMerge = globalUpdateCount > 300;
    const { maxFitOrganism, ...stats } = yield population.runGeneration(isMerge);
    const organism = omit(maxFitOrganism, ['phenotype']);
    if (isMerge) {
      globalUpdateCount = 0; // reset count
      monitoredBest = 0;
      console.log('PERFORMED MERGED', stats.genId);
    }

    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, maxFitOrganism);
      yield delay(10);
    }

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }));
    }

    // Update the list of maxFitness scores
    yield put(updateCurrentGen({
      currentBest: { organism, genId: stats.genId },
      stats,
    }));

    // Update the list of maxFitness scores
    const result = yield call(generationResultsCheckSaga, {
      currentBest: { organism, genId: stats.genId },
      stats,
      stopCriteria: parameters.stopCriteria,
      maxFitOrganism,
    });
    // The experiment has met one of the stop criteria, signal that it's complete
    if (result) return true;
  }
}

function* runSimulationsSaga() {
  // TODO: Combine into one call
  let pendingSimulation = yield getNextPendingSimulation();
  yield setCurrentSimulation(pendingSimulation.id);

  while (pendingSimulation) {
    yield setCurrentSimulation(pendingSimulation.id);
    const doContinue = yield call(runSimulationSaga, pendingSimulation);
    // If user reset simulations, exit early and don't mark them complete
    if (!doContinue) return;

    pendingSimulation = yield getNextPendingSimulation();
  }

  yield setCurrentSimulation(null);
  yield put(endSimulations());
}

function* simulationSaga() {
  yield takeEvery(runSimulations, runSimulationsSaga);
  yield takeEvery(RESTORE_POPULATION, restorePopulationSaga);
}

export default simulationSaga;
