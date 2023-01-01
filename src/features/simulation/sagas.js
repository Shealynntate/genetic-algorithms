import {
  call,
  put,
  select,
  takeEvery,
  delay,
  getContext,
} from 'redux-saga/effects';
import { omit } from 'lodash';
import {
  addImageToDatabase,
  addStatsToDatabase,
  clearDatabase,
  insertSimulation,
} from '../../globals/database';
import { targetFitness } from '../../constants';
import { approxEqual } from '../../globals/statsUtils';
import { createImageData, shouldSaveGenImage } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import {
  endSimulation, resetSimulation, runSimulation,
} from '../ux/uxSlice';
import {
  clearGenStats,
  RESTORE_POPULATION,
  setCurrentBest,
  setGlobalBest,
  setTargetFitnessReached,
  updateCurrentGen,
} from './simulationSlice';

function* targetReachedSaga({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

function* runGenerationSaga() {
  const { population } = yield getContext('population');
  // Save the first generation image
  if (population.genId === 0) {
    yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
    yield delay(10);
  }

  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) return;

    // First run the next generation of the simulation
    const { maxFitOrganism, ...stats } = yield population.runGeneration();

    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, maxFitOrganism);
      yield delay(10);
    }

    const organism = omit(maxFitOrganism, ['phenotype']);

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }));
      // Check if this new best reaches our target fitness
      yield call(targetReachedSaga, organism);
    }
    // Update the list of maxFitness scores
    yield call(addStatsToDatabase, stats);
    yield put(updateCurrentGen({
      currentBest: { organism, genId: stats.genId },
      stats,
    }));
  }
}

function* runSimulationSaga() {
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

    // Store our parameters in the database
    // TODO: Use the context instead in DB
    const store = yield select((state) => state);
    yield call(insertSimulation, populationService.serialize(), store);
  }

  yield call(runGenerationSaga);
}

function* resetSimulationSaga() {
  const populationService = yield getContext('population');
  yield put(setCurrentBest({}));
  yield put(setGlobalBest());
  yield put(clearGenStats());
  yield call(clearDatabase);
  populationService.reset();
}

export function* restorePopulationSaga({ payload: populationData }) {
  const target = yield select((state) => state.parameters.target);
  const populationService = yield getContext('population');
  const { data } = yield createImageData(target);
  yield populationService.restore({ target: data, ...populationData });
}

function* simulationSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
  yield takeEvery(RESTORE_POPULATION, restorePopulationSaga);
}

export default simulationSaga;
