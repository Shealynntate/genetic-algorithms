import {
  call,
  put,
  select,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import { SelectionType, targetFitness } from '../../constants';
import RandomNoise from '../../globals/randomNoise';
import { approxEqual, createImageData, generateTreeLayer } from '../../globals/utils';
import { isRunningSelector } from '../../hooks';
import Population from '../../models/population';
import { endSimulation, resetSimulation, runSimulation } from '../ux/uxSlice';
import {
  setCurrentGen,
  setGenealogyTree,
  setGlobalBest,
  setTargetFitnessReached,
} from './metadataSlice';

let population;
let randomNoise;
const runDelay = 0;

function* processNextGenerationSaga(parentGen, nextGen) {
  const parentLayer = generateTreeLayer([parentGen, nextGen], 0);
  const newLayer = generateTreeLayer([parentGen, nextGen], 1);
  const tree = [parentLayer, newLayer];
  yield put(setGenealogyTree(tree));
}

function* runGenerationSaga() {
  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) return;

    const [parentGen, nextGen] = population.runGeneration(SelectionType.TOURNAMENT, randomNoise);
    yield call(processNextGenerationSaga, parentGen, nextGen);
    yield put(setCurrentGen(nextGen));
    yield delay(runDelay);
  }
}

function* runSimulationSaga() {
  const populationSize = yield select((state) => state.metadata.populationSize);
  const triangleCount = yield select((state) => state.metadata.triangleCount);
  const target = yield select((state) => state.metadata.target);
  const mutation = yield select((state) => state.metadata.mutationRate);

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

function* updateGlobalBestSaga({ payload }) {
  const { id, maxFitOrganism } = payload;
  const globalBest = yield select((state) => state.metadata.globalBest);
  // If we're resetting the state, the currentGen will be empty
  if (!maxFitOrganism) return;

  const currentBest = globalBest?.organism.fitness || -1;
  // Check if the latest generation's most fit organism can beat our global best
  if (maxFitOrganism.fitness > currentBest) {
    yield put(setGlobalBest({ id, organism: maxFitOrganism }));
    // Check if this new best reaches our target fitness
    yield call(targetReachedSaga, maxFitOrganism);
  }
}

function* resetSimulationSaga() {
  yield put(setCurrentGen({}));
  yield put(setGenealogyTree([]));
}

function* metadataSaga() {
  yield takeEvery(runSimulation, runSimulationSaga);
  yield takeEvery(setCurrentGen, updateGlobalBestSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
}

export default metadataSaga;
