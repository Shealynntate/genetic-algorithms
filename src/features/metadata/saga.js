import {
  call,
  put,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import { addImageToDatabase, clearDatabase, initializeDBEntry } from '../../globals/database';
import { targetFitness } from '../../constants';
import { approxEqual, setSigFigs } from '../../globals/statsUtils';
import { createImageData, shouldSaveGenImage } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import Population from '../../models/population';
import { endSimulation, resetSimulation, runSimulation } from '../ux/uxSlice';
import {
  addMaxFitnessScore,
  clearMaxFitnessScores,
  setCurrentGen,
  setGlobalBest,
  setTargetFitnessReached,
} from './metadataSlice';
import Mutation from '../../models/mutation';
import Crossover from '../../models/crossover';
import Selection from '../../models/selection';

let population;
const fitnessSigFigs = 3;

clearDatabase();

function* processNextGenerationSaga(gen) {
  // Update the list of maxFitness scores
  const { maxFitness } = gen;
  yield put(addMaxFitnessScore(setSigFigs(maxFitness, fitnessSigFigs)));
}

function* runGenerationSaga() {
  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) return;

    // Check if we should store a copy of the maxFitOrganism for Image History
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      yield delay(10);
    }
    console.time('Run Generation');
    const gen = yield population.runGeneration();
    console.timeEnd('Run Generation');
    yield call(processNextGenerationSaga, gen);
    yield put(setCurrentGen(gen));
  }
}

function* runSimulationSaga() {
  const populationSize = yield select((state) => state.parameters.populationSize);
  const triangleCount = yield select((state) => state.parameters.triangleCount);
  const target = yield select((state) => state.parameters.target);
  const crossover = yield select((state) => state.parameters.crossover);
  const mutation = yield select((state) => state.parameters.mutation);
  const selection = yield select((state) => state.parameters.selection);
  if (!population) {
    // Store our parameters in the database
    yield call(initializeDBEntry, {
      triangleCount,
      selection,
      populationSize,
      mutation,
    });
    const { data } = yield createImageData(target);
    // Initialize the population
    population = new Population({
      size: populationSize,
      genomeSize: triangleCount,
      target: data,
      crossover: new Crossover(crossover),
      mutation: new Mutation(mutation),
      selection: new Selection(selection),
    });
    yield population.initialize();
  }

  yield call(runGenerationSaga);
}

function* targetReachedSaga({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

// let lastSavedId = -10;

function* updateGlobalBestSaga({ payload }) {
  const { id, maxFitOrganism } = payload;
  const globalBest = yield select((state) => state.metadata.globalBest);
  // If we're resetting the state, the currentGen will be empty
  if (!maxFitOrganism) return;

  const currentBest = globalBest?.organism.fitness || -1;
  // Check if the latest generation's most fit organism can beat our global best
  if (maxFitOrganism.fitness > currentBest) {
    yield put(setGlobalBest({ id, organism: maxFitOrganism }));
    // Check if we should store a copy of the maxFitOrganism for Image History
    // if (shouldSaveGenImage(population.genId)) {
    // if (population.genId >= lastSavedId + 10) {
    //   lastSavedId = population.genId;
    //   yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
    //   yield delay(10);
    // }
    // Check if this new best reaches our target fitness
    yield call(targetReachedSaga, maxFitOrganism);
  }
}

function* resetSimulationSaga() {
  yield put(setCurrentGen({}));
  yield put(clearMaxFitnessScores());
  yield call(clearDatabase);
}

function* metadataSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(setCurrentGen, updateGlobalBestSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
}

export default metadataSaga;
