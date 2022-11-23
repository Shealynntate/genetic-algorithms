import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import { targetFitness } from '../../constants';
import { approxEqual } from '../../globals/utils';
import { endSimulation } from '../ux/uxSlice';
import { setCurrentGen, setGlobalBest, setTargetFitnessReached } from './metadataSlice';

function* checkIfTargetReached({ fitness }) {
  if (approxEqual(fitness, targetFitness)) {
    yield put(setTargetFitnessReached());
    yield put(endSimulation());
  }
}

function* updateGlobalBest({ payload }) {
  const { id, maxFitOrganism } = payload;
  const globalBest = yield select((state) => state.metadata.globalBest);
  const currentBest = globalBest?.organism.fitness || -1;
  // Check if the latest generation's most fit organism can beat our global best
  if (maxFitOrganism.fitness > currentBest) {
    yield put(setGlobalBest({ id, organism: maxFitOrganism }));
    // Check if this new best reaches our target fitness
    yield call(checkIfTargetReached, maxFitOrganism);
  }
}

function* metadataSaga() {
  yield takeEvery(setCurrentGen, updateGlobalBest);
}

export default metadataSaga;
