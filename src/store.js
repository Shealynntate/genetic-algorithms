import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import metadataReducer from './features/metadata/metadataSlice';
import metadataSaga from './features/metadata/saga';
import parametersReducer from './features/parameters/parametersSlice';
import uxReducer from './features/ux/uxSlice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    parameters: parametersReducer,
    ux: uxReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(metadataSaga);

export default store;
