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
  addImageToDatabase,
  addResultsToCurrentSimulation,
  getNextPendingSimulation,
  updateCurrentSimulation,
} from '../../globals/database';
import { approxEqual } from '../../globals/statsUtils';
import { createImageData, shouldSaveGenImage } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import {
  RESTORE_POPULATION, setGenStats, setGlobalBest, updateCurrentGen,
} from './simulationSlice';
import {
  endSimulations,
  resetSimulations,
  resumeSimulations,
  runSimulations,
} from '../ux/uxSlice';

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
}

function* generationResultsCheckSaga({
  stopCriteria,
  currentBest,
  stats,
}) {
  const { population } = yield getContext('population');
  const globalBest = yield select((state) => state.simulation.globalBest);
  const currentStats = yield select((state) => state.simulation.currentStats);

  const { targetFitness, maxGenerations } = stopCriteria;
  const isSuccess = hasReachedTarget(globalBest, targetFitness);
  const isStopping = isSuccess || currentBest.genId >= maxGenerations;

  // Store results if needed
  const latestThreshold = currentStats.threshold ?? 0;
  const currentMax = Math.trunc(stats.maxFitness * 1000) / 1000;
  if (currentMax > latestThreshold && currentMax >= minExperimentThreshold) {
    yield addResultsToCurrentSimulation({ threshold: currentMax, stats });
    yield put(setGenStats({ threshold: currentMax, stats }));
  }

  // Check if the simulation is over
  if (isStopping) {
    // Stop the simulation and add the results to database
    yield addResultsToCurrentSimulation({ threshold: currentMax, stats });
    yield updateCurrentSimulation({
      population: population.serialize(),
      status: SimulationStatus.COMPLETE,
    });
    yield call(resetSimulationsSaga);
    return true;
  }
  return false;
}

function* runSimulationSaga({ parameters, stopCriteria }) {
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
      },
    } = parameters;
    const { data } = yield createImageData(target);

    population = yield populationService.create({
      size,
      minGenomeSize: minPolygons,
      maxGenomeSize: maxPolygons,
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
  // Run the experiment in a loop until one of the stop criteria is met
  while (true) {
    // If the experiment has been paused, wait until a resume or reset action has been fired
    if (!(yield select(isRunningSelector))) {
      const { reset } = yield race({
        resume: take(resumeSimulations),
        reset: take(resetSimulations),
      });
      // Reset was called, exit early
      if (reset) {
        yield call(resetSimulationsSaga);
        return false;
      }
    }

    if (population.genId === 0) {
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      yield delay(10);
    }

    // First run the next generation of the simulation
    const { maxFitOrganism, ...stats } = yield population.runGeneration();
    const organism = omit(maxFitOrganism, ['phenotype']);

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
      stopCriteria,
    });
    // The experiment has met one of the stop criteria, signal that it's complete
    if (result) return true;
  }
}

function* runSimulationsSaga() {
  let pendingSimulation = yield getNextPendingSimulation();

  while (pendingSimulation) {
    const doContinue = yield call(runSimulationSaga, pendingSimulation);
    // If user reset simulations, exit early and don't mark them complete
    if (!doContinue) return;

    pendingSimulation = yield getNextPendingSimulation();
  }

  yield put(endSimulations());
}

function* simulationSaga() {
  yield takeEvery(runSimulations, runSimulationsSaga);
  yield takeEvery(RESTORE_POPULATION, restorePopulationSaga);
}

export default simulationSaga;
