import { put, select, takeEvery } from 'redux-saga/effects';
import { setCurrentGen, setGlobalBest } from './metadataSlice';

function* updateGlobalBest({ payload }) {
  const { id, maxFitOrganism } = payload;
  const globalBest = yield select((state) => state.metadata.globalBest);
  const currentBest = globalBest?.organism.fitness || -1;
  // Check if the latest generation's most fit organism can beat our global best
  if (maxFitOrganism.fitness > currentBest) {
    yield put(setGlobalBest({ id, organism: maxFitOrganism }));
  }
}

function* metadataSaga() {
  yield takeEvery(setCurrentGen, updateGlobalBest);
}

export default metadataSaga;
