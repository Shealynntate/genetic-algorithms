import { omit } from 'lodash';
import {
  call,
  getContext,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { SimulationState } from '../../constants';
import { addExperimentToDatabase } from '../../globals/database';
import { createImageData } from '../../globals/utils';
import { isExperimentationModeSelector, isRunningSelector } from '../../hooks';
import { setGlobalBest } from '../simulation/simulationSlice';
import {
  pauseSimulation, runExperiments, setSimulationState,
} from '../ux/uxSlice';
import {
  addResults,
  completeExperiments, setupExperiment, startExperiments, stopExperiment,
} from './experimentationSlice';

function* resetExperimentSaga() {
  const populationService = yield getContext('population');
  yield put(setGlobalBest());
  populationService.reset();
}

function* experimentDaemonSaga({ currentBest, stats }) {
  const isExperimentationMode = yield select(isExperimentationModeSelector);
  const globalBest = yield select((state) => state.simulation.globalBest);
  const parameters = yield select((state) => state.experimentation.parameters);
  const stopCriteria = yield select((state) => state.experimentation.stopCriteria);
  const results = yield select((state) => state.experimentation.results);
  // Make sure we're in experimentation mode before doing anything
  if (!isExperimentationMode) return;

  const { targetFitness, maxGenerations } = stopCriteria;
  const isSuccess = globalBest ? globalBest.organism.fitness >= targetFitness : false;
  const isStopping = isSuccess || currentBest.genId >= maxGenerations;

  // Store results if needed
  const latestThreshold = results.length ? results[results.length - 1].threshold : 1;
  const currentMax = Math.trunc(stats.maxFitness * 100);
  if (currentMax > Math.trunc(latestThreshold * 100)) {
    yield put(addResults({ threshold: currentMax / 100, stats }));
  }

  // Check if the experiment is over
  if (isStopping) {
    // Stop experiment and add experiment results to database
    yield put(pauseSimulation());
    yield call(
      addExperimentToDatabase,
      parameters,
      stopCriteria,
      [...results, { threshold: currentMax, stats }],
    );
    yield call(resetExperimentSaga);
    // TODO: Make this less clunky, maybe combine sagas and/or move Population into context
    yield put(setSimulationState(SimulationState.PAUSED_EXPERIMENTS));
    yield put(stopExperiment(isSuccess));
  }
}

function* runExperimentSaga(experimentData) {
  // Set parameters in redux
  yield put(setupExperiment(experimentData));
  // Run the experiment
  yield put(runExperiments());
  const populationService = yield getContext('population');
  const populationSize = yield select((state) => state.parameters.populationSize);
  const triangleCount = yield select((state) => state.parameters.triangleCount);
  const maxTriangleCount = yield select((state) => state.parameters.maxTriangleCount);
  const target = yield select((state) => state.parameters.target);
  const crossoverParams = yield select((state) => state.parameters.crossover);
  const mutationParams = yield select((state) => state.parameters.mutation);
  const selectionParams = yield select((state) => state.parameters.selection);
  if (!populationService.population) {
    const { data } = yield createImageData(target);

    // Initialize the population
    yield populationService.create({
      size: populationSize,
      genomeSize: triangleCount,
      maxGenomeSize: maxTriangleCount,
      target: data,
      mutation: mutationParams,
      crossover: crossoverParams,
      selection: selectionParams,
    });
  }

  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) break;

    // First run the next generation of the simulation
    const { maxFitOrganism, ...stats } = yield populationService.getPopulation().runGeneration();
    const organism = omit(maxFitOrganism, ['phenotype']);

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }));
    }
    // Update the list of maxFitness scores
    yield call(experimentDaemonSaga, {
      currentBest: { organism, genId: stats.genId },
      stats,
    });
  }
}

function* runExperimentsSaga({ payload: tests }) {
  for (let i = 0; i < tests.length; ++i) {
    yield call(runExperimentSaga, tests[i]);
  }
  yield put(completeExperiments());
}

function* experimentationSaga() {
  yield takeEvery(startExperiments, runExperimentsSaga);
}

export default experimentationSaga;
