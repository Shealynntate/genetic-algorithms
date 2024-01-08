import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import parametersReducer from './parameters/parametersSlice';
import populationService from './population/population-context';
import rootSaga from './rootSaga';
import simulationReducer from './simulation/simulationSlice';
import uxReducer from './ux/uxSlice';

const sagaMiddleware = createSagaMiddleware({
  context: {
    population: populationService,
  },
});

const store = configureStore({
  reducer: {
    parameters: parametersReducer,
    simulation: simulationReducer,
    ux: uxReducer,
  },
  middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
