import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import simulationReducer from './features/simulation/simulationSlice';
import parametersReducer from './features/parameters/parametersSlice';
import rootSaga from './features/rootSaga';
import uxReducer from './features/ux/uxSlice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    simulation: simulationReducer,
    parameters: parametersReducer,
    ux: uxReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
