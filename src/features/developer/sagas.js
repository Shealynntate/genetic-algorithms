import { put, takeEvery } from 'redux-saga/effects';
import { downloadJSON } from '../../globals/utils';
import { restorePopulation } from '../simulation/simulationSlice';
import { serializePopulation } from '../simulation/sagas';
import { DOWNLOAD, REHYDRATE } from './developerSlice';

function downloadSaga({ payload: { fileName, state } }) {
  downloadJSON(
    fileName,
    {
      population: serializePopulation(),
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
