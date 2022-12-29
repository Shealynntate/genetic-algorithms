import {
  call,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { addExperimentToDatabase } from '../../globals/database';
import { isExperimentationModeSelector } from '../../hooks';
import { updateCurrentGen } from '../simulation/simulationSlice';
import { pauseSimulation, runExperiment } from '../ux/uxSlice';
import {
  completeExperiments, setupExperiment, startExperiments, stopExperiment,
} from './experimentationSlice';

function* runExperimentSaga(experimentData) {
  // Set parameters in redux
  yield put(setupExperiment(experimentData));
  // Run the experiment
  yield put(runExperiment());
  // Wait to hear stop action from Daemon
  const result = yield take(stopExperiment);
  return result;
}

function* runExperimentsSaga({ payload: tests }) {
  for (let i = 0; i < tests.length; ++i) {
    yield call(runExperimentSaga, tests[i]);
  }
  yield put(completeExperiments);
}

function* experimentDaemonSaga({ payload: { currentBest, stats } }) {
  const isExperimentationMode = yield select(isExperimentationModeSelector);
  const { organism: { fitness } } = yield select((state) => state.simulation.globalBest);
  const parameters = yield select((state) => state.experimentation.parameters);
  const stopCriteria = yield select((state) => state.experimentation.stopCriteria);
  // Make sure we're in experimentation mode before doing anything
  if (!isExperimentationMode) return;

  const { targetFitness, maxGenerations } = stopCriteria;
  const isSuccess = fitness >= targetFitness;
  const isStopping = isSuccess || currentBest.genId >= maxGenerations;
  if (isStopping) {
    // Stop experiment and add experiment results to database
    yield put(pauseSimulation());
    yield put(stopExperiment(isSuccess));
    yield call(addExperimentToDatabase, parameters, stopCriteria, stats);
  }
}

function* experimentationSaga() {
  yield takeEvery(startExperiments, runExperimentsSaga);
  yield takeEvery(updateCurrentGen, experimentDaemonSaga);
}

export default experimentationSaga;
