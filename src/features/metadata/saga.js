import {
  call,
  put,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import { addImageToDatabase, clearDatabase, initializeDBEntry } from '../../globals/database';
import { targetFitness } from '../../constants';
import RandomNoise from '../../globals/randomNoise';
import { approxEqual, setSigFigs } from '../../globals/stats';
import {
  createImageData,
  generateTreeLayer,
  shouldSaveGenImage,
} from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import Population from '../../models/population';
import { endSimulation, resetSimulation, runSimulation } from '../ux/uxSlice';
import {
  addMaxFitnessScore,
  clearMaxFitnessScores,
  setCurrentGen,
  setGenealogyTree,
  setGlobalBest,
  setTargetFitnessReached,
} from './metadataSlice';

let population;
let randomNoise;
const runDelay = 0;
const fitnessSigFigs = 3;
const stagnationThreshold = 200;

clearDatabase();

function* processNextGenerationSaga(parentGen, nextGen) {
  randomNoise.nextGeneration();

  // Update the list of maxFitness scores
  const { maxFitness } = parentGen;
  yield put(addMaxFitnessScore(setSigFigs(maxFitness, fitnessSigFigs)));
  // Form the next layer of the Genealogy Tree
  const parentLayer = generateTreeLayer([parentGen, nextGen], 0);
  const newLayer = generateTreeLayer([parentGen, nextGen], 1);
  const tree = [parentLayer, newLayer];
  yield put(setGenealogyTree(tree));
}

function* runGenerationSaga() {
  const selectionType = yield select((state) => state.parameters.selectionType);
  const eliteCount = yield select((state) => state.parameters.eliteCount);

  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) return;

    // Check if we should store a copy of the maxFitOrganism for Image History
    if (shouldSaveGenImage(population.genId)) {
      yield call(addImageToDatabase, population.genId, population.maxFitOrganism());
      yield delay(10);
    }
    const [parentGen, nextGen] = population.runGeneration(selectionType, eliteCount, randomNoise);
    yield call(processNextGenerationSaga, parentGen, nextGen);
    yield put(setCurrentGen(nextGen));
    yield delay(runDelay);
  }
}

function* runSimulationSaga() {
  const populationSize = yield select((state) => state.parameters.populationSize);
  const eliteCount = yield select((state) => state.parameters.eliteCount);
  const selectionType = yield select((state) => state.parameters.selectionType);
  const triangleCount = yield select((state) => state.parameters.triangleCount);
  const target = yield select((state) => state.parameters.target);
  const mutation = yield select((state) => state.parameters.mutationRate);
  // Store our parameters in the database
  yield call(initializeDBEntry, {
    triangleCount,
    selectionType,
    populationSize,
    eliteCount,
    mutation,
  });
  const { data } = yield createImageData(target);
  if (!population) {
    population = new Population(populationSize, triangleCount, data);
  }
  randomNoise = new RandomNoise(mutation);

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

function* stagnationDaemonSaga() {
  const scores = yield select((state) => state.metadata.maxFitnessScores);
  const start = scores.length - stagnationThreshold - 1;
  if (start < 0 || randomNoise.inDecay) {
    return;
  }
  for (let i = start; i < scores.length; ++i) {
    if (scores[i] > scores[start]) {
      // A generation's max score has improved within the threshold, don't disrupt
      return;
    }
  }
  // Create disruption event
  // randomNoise.disrupt();
}

function* resetSimulationSaga() {
  yield put(setCurrentGen({}));
  yield put(setGenealogyTree([]));
  yield put(clearMaxFitnessScores());
  yield call(clearDatabase);
}

function* metadataSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(setCurrentGen, updateGlobalBestSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
  yield takeEvery(addMaxFitnessScore, stagnationDaemonSaga);
}

export default metadataSaga;
