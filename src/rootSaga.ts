import { type ForkEffect, fork } from 'redux-saga/effects'

import simulationSaga from './simulation/sagas'

export default function* rootSaga(): Generator<
  ForkEffect<void>,
  void,
  unknown
> {
  yield fork(simulationSaga)
}
