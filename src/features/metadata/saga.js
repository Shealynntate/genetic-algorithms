import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { targetFitness } from '../../constants';
import { approxEqual } from '../../globals/utils';
import { endSimulation, resetSimulation } from '../ux/uxSlice';
import { setCurrentGen, setGlobalBest, setTargetFitnessReached } from './metadataSlice';

function* targetReachedSaga({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

function* setGlobalBestSaga({ payload }) {
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
}

function* metadataSaga() {
  yield takeEvery(setCurrentGen, setGlobalBestSaga);
  yield takeEvery(resetSimulation, resetSimulationSaga);
}

export default metadataSaga;
