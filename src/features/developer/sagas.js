import { getContext, put, takeEvery } from 'redux-saga/effects';
import { downloadJSON } from '../../globals/utils';
import { restorePopulation } from '../simulation/simulationSlice';
import { DOWNLOAD, REHYDRATE } from './developerSlice';

function* downloadSaga({ payload: { fileName, state } }) {
  const populationService = yield getContext('populationService');
  downloadJSON(
    fileName,
    {
      population: populationService.serialize(),
      ...state,
    },
  );
}

function* rehydrateSaga({ payload: state }) {
  yield put(restorePopulation(state.population));
}

function* developerSaga() {
  yield takeEvery(REHYDRATE, rehydrateSaga);
  yield takeEvery(DOWNLOAD, downloadSaga);
}

export default developerSaga;
