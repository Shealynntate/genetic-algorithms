import {
  call,
  put,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import { omit } from 'lodash';
import { addImageToDatabase, clearDatabase, initializeDBEntry } from '../../globals/database';
import { targetFitness } from '../../constants';
import { approxEqual } from '../../globals/statsUtils';
import { createImageData, shouldSaveGenImage } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import Population from '../../models/population';
import { endSimulation, resetSimulation, runSimulation } from '../ux/uxSlice';
import {
  clearGenStats,
  setCurrentBest,
  setGlobalBest,
  setTargetFitnessReached,
  updateCurrentGen,
} from './metadataSlice';
import Mutation from '../../models/mutation';
import Crossover from '../../models/crossover';
import Selection from '../../models/selection';

let population;
let mutation;

clearDatabase();

function* targetReachedSaga({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

function* runGenerationSaga() {
  while (true) {
    const isRunning = yield select(isRunningSelector);
    const globalBest = yield select((state) => state.metadata.globalBest);
    const globalFitness = globalBest?.organism.fitness || -1;

    if (!isRunning) return;

    // Should we store a copy of the maxFitOrganism for Image History?
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      yield delay(10);
    }
    // console.time('Run Generation');
    const gen = yield population.runGeneration();
    // console.timeEnd('Run Generation');

    // Update the list of maxFitness scores
    const stats = omit(gen, ['maxFitOrganism']);
    stats.isBest = gen.maxFitness > globalFitness;
    yield put(updateCurrentGen({
      currentBest: { organism: gen.maxFitOrganism, genId: gen.genId },
      genStats: stats,
    }));

    // Upodate Mutation Rate
    let prob = 0.5;
    if (gen.genId > 4_000) prob = 0.25;
    if (gen.genId > 10_000) prob = 0.1;
    if (gen.genId > 15_000) prob = 0.05;
    mutation.setProbability(prob);

    // Check if the latest generation's most fit organism can beat our global best
    if (gen.maxFitness > globalFitness) {
      yield put(setGlobalBest({ genId: gen.genId, organism: gen.maxFitOrganism }));
      // Check if we should store a copy of the maxFitOrganism for Image History
      // if (shouldSaveGenImage(population.genId)) {
      // if (population.genId >= lastSavedId + 10) {
      //   lastSavedId = population.genId;
      //   yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      //   yield delay(10);
      // }
      // Check if this new best reaches our target fitness
      yield call(targetReachedSaga, gen.maxFitOrganism);
    }
  }
}

function* runSimulationSaga() {
  const populationSize = yield select((state) => state.parameters.populationSize);
  const triangleCount = yield select((state) => state.parameters.triangleCount);
  const target = yield select((state) => state.parameters.target);
  const crossover = yield select((state) => state.parameters.crossover);
  const mutationParams = yield select((state) => state.parameters.mutation);
  const selection = yield select((state) => state.parameters.selection);
  if (!population) {
    // Store our parameters in the database
    yield call(initializeDBEntry, {
      triangleCount,
      selection,
      populationSize,
      mutation: mutationParams,
    });
    const { data } = yield createImageData(target);
    mutation = new Mutation(mutationParams);
    // Initialize the population
    population = new Population({
      size: populationSize,
      genomeSize: triangleCount,
      target: data,
      mutation,
      crossover: new Crossover(crossover),
      selection: new Selection(selection),
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

function* metadataSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
}

export default metadataSaga;
