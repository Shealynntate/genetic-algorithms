import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import experimentationReducer from './features/experimentation/experimentationSlice';
import parametersReducer from './features/parameters/parametersSlice';
import populationService from './features/population-context';
import rootSaga from './features/rootSaga';
import simulationReducer from './features/simulation/simulationSlice';
import uxReducer from './features/ux/uxSlice';

const sagaMiddleware = createSagaMiddleware({
  context: {
    population: populationService,
  },
});

const store = configureStore({
  reducer: {
    experimentation: experimentationReducer,
    parameters: parametersReducer,
    simulation: simulationReducer,
    ux: uxReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
