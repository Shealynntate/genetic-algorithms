import { omit } from 'lodash';
import {
  call,
  getContext,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { minExperimentThreshold } from '../../constants';
import { addExperimentToDatabase } from '../../globals/database';
import { createImageData } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import { setGlobalBest } from '../simulation/simulationSlice';
import {
  resetExperiments,
  runExperiments,
} from '../ux/uxSlice';
import {
  addResults,
  completeExperiments,
  setupExperiment,
  startExperiments,
} from './experimentationSlice';

function* resetExperimentSaga() {
  const populationService = yield getContext('population');
  yield put(setGlobalBest());
  populationService.reset();
}

function* generationResultsCheckSaga({ currentBest, stats }) {
  const globalBest = yield select((state) => state.simulation.globalBest);
  const parameters = yield select((state) => state.experimentation.parameters);
  const stopCriteria = yield select((state) => state.experimentation.stopCriteria);
  const results = yield select((state) => state.experimentation.results);

  const { targetFitness, maxGenerations } = stopCriteria;
  const isSuccess = globalBest ? globalBest.organism.fitness >= targetFitness : false;
  const isStopping = isSuccess || currentBest.genId >= maxGenerations;

  // Store results if needed
  const latestThreshold = results.length ? results[results.length - 1].threshold : 0;
  const currentMax = Math.trunc(stats.maxFitness * 100) / 100;
  if (currentMax > latestThreshold && currentMax >= minExperimentThreshold) {
    yield put(addResults({ threshold: currentMax, stats }));
  }

  // Check if the experiment is over
  if (isStopping) {
    // Stop experiment and add experiment results to database
    const fullResults = [...results, { threshold: currentMax, stats }];
    yield call(addExperimentToDatabase, parameters, stopCriteria, fullResults);
    yield call(resetExperimentSaga);
    return true;
  }
  return false;
}

function* runExperimentSaga(experimentData) {
  // Set parameters in redux
  yield put(setupExperiment(experimentData));
  const populationService = yield getContext('population');

  // Initialize the population if we're starting a new run
  if (!populationService.population) {
    const {
      parameters: {
        crossover,
        maxTriangleCount,
        mutation,
        populationSize,
        selection,
        target,
        triangleCount,
      },
    } = experimentData;
    const { data } = yield createImageData(target);

    yield populationService.create({
      size: populationSize,
      genomeSize: triangleCount,
      maxGenomeSize: maxTriangleCount,
      target: data,
      mutation,
      crossover,
      selection,
    });
  }

  yield put(runExperiments());
  // Run the experiment in a loop until one of the stop criteria is met
  while (true) {
    // If the experiment has been paused, wait until a resume or reset action has been fired
    if (!(yield select(isRunningSelector))) {
      const { reset } = yield race({
        resume: take(runExperiments),
        reset: take(resetExperiments),
      });
      // Reset was called, exit early
      if (reset) {
        yield call(resetExperimentSaga);
        return false;
      }
    }

    // First run the next generation of the simulation
    const { maxFitOrganism, ...stats } = yield populationService.population.runGeneration();
    const organism = omit(maxFitOrganism, ['phenotype']);

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }));
    }
    // Update the list of maxFitness scores
    const result = yield call(generationResultsCheckSaga, {
      currentBest: { organism, genId: stats.genId },
      stats,
    });
    // The experiment has met one of the stop criteria, signal that it's complete
    if (result) return true;
  }
}

function* runExperimentsSaga({ payload: tests }) {
  for (let i = 0; i < tests.length; ++i) {
    const doContinue = yield call(runExperimentSaga, tests[i]);
    // If user reset experiments, exit early and don't mark them complete
    if (!doContinue) return;
  }
  yield put(completeExperiments());
}

function* experimentationSaga() {
  yield takeEvery(startExperiments, runExperimentsSaga);
}

export default experimentationSaga;
