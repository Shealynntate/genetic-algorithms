import { fork } from 'redux-saga/effects';
import developerSaga from './developer/sagas';
import simulationSaga from './simulation/sagas';
import experimentationSaga from './experimentation/sagas';

export default function* rootSaga() {
  yield fork(simulationSaga);
  yield fork(developerSaga);
  yield fork(experimentationSaga);
}
