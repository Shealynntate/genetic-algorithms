import {
  call,
  put,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import { omit } from 'lodash';
import {
  addImageToDatabase,
  addStatsToDatabase,
  clearDatabase,
  initializeDBEntry,
} from '../../globals/database';
import { targetFitness } from '../../constants';
import { approxEqual } from '../../globals/statsUtils';
import { createImageData, shouldSaveGenImage } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import Population from '../../models/population';
import { endSimulation, resetSimulation, runSimulation } from '../ux/uxSlice';
import {
  clearGenStats,
  RESTORE_POPULATION,
  setCurrentBest,
  setGlobalBest,
  setTargetFitnessReached,
  updateCurrentGen,
} from './simulationSlice';

let population;

clearDatabase();

function* targetReachedSaga({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

function* runGenerationSaga() {
  // Save the first generation image
  yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
  yield delay(10);

  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) return;

    // console.time('Run Generation');
    // First run the next generation of the simulation
    const { maxFitOrganism, ...stats } = yield population.runGeneration();
    // console.timeEnd('Run Generation');

    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, maxFitOrganism);
      yield delay(10);
    }

    // Update the list of maxFitness scores
    const organism = omit(maxFitOrganism, ['phenotype']);
    yield call(addStatsToDatabase, stats);
    yield put(updateCurrentGen({
      currentBest: { organism, genId: stats.genId },
      stats,
    }));

    // Check if the latest generation's most fit organism can beat our global best
    if (stats.isGlobalBest) {
      yield put(setGlobalBest({ genId: stats.genId, organism }));
      // Check if this new best reaches our target fitness
      yield call(targetReachedSaga, organism);
    }
  }
}

function* runSimulationSaga() {
  const populationSize = yield select((state) => state.parameters.populationSize);
  const triangleCount = yield select((state) => state.parameters.triangleCount);
  const target = yield select((state) => state.parameters.target);
  const crossoverParams = yield select((state) => state.parameters.crossover);
  const mutationParams = yield select((state) => state.parameters.mutation);
  const selectionParams = yield select((state) => state.parameters.selection);
  if (!population) {
    // Store our parameters in the database
    yield call(initializeDBEntry, {
      triangleCount,
      selection: selectionParams,
      populationSize,
      mutation: mutationParams,
    });
    const { data } = yield createImageData(target);

    // Initialize the population
    population = new Population({
      size: populationSize,
      genomeSize: triangleCount,
      target: data,
      mutation: mutationParams,
      crossover: crossoverParams,
      selection: selectionParams,
    });
    yield population.initialize();
  }

  yield call(runGenerationSaga);
}

function* resetSimulationSaga() {
  yield put(setCurrentBest({}));
  yield put(setGlobalBest());
  yield put(clearGenStats());
  yield call(clearDatabase);
}

export const serializePopulation = () => population.serialize();

export function* restorePopulationSaga({ payload: populationData }) {
  const target = yield select((state) => state.parameters.target);
  const { data } = yield createImageData(target);
  population = Population.restorePopulation({ target: data, ...populationData });
  yield population.initialize();
}

function* simulationSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
  yield takeEvery(RESTORE_POPULATION, restorePopulationSaga);
}

export default simulationSaga;
