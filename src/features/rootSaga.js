import { fork } from 'redux-saga/effects';
import simulationSaga from './simulation/sagas';

export default function* rootSaga() {
  yield fork(simulationSaga);
}
