import { put, takeEvery } from 'redux-saga/effects';
import { downloadJSON } from '../../globals/utils';
import { rehydrateSimulation, restorePopulation } from '../simulation/simulationSlice';
import { serializePopulation } from '../simulation/sagas';
import { rehydrateParameters } from '../parameters/parametersSlice';
import { rehydrateUx } from '../ux/uxSlice';
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
  yield put(rehydrateSimulation(state.simulation));
  yield put(rehydrateParameters(state.parameters));
  yield put(rehydrateUx(state.ux));
  yield put(restorePopulation(state.population));
}

function* developerSaga() {
  yield takeEvery(REHYDRATE, rehydrateSaga);
  yield takeEvery(DOWNLOAD, downloadSaga);
}

export default developerSaga;
