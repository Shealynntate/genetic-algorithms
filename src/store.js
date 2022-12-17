import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import metadataReducer, { rehydrateMetadata } from './features/metadata/metadataSlice';
import metadataSaga from './features/metadata/saga';
import parametersReducer, { rehydrateParameters } from './features/parameters/parametersSlice';
import uxReducer, { rehydrateUx } from './features/ux/uxSlice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    parameters: parametersReducer,
    ux: uxReducer,
  },
  middleware: [sagaMiddleware],
});

export const rehydrate = (state) => {
  rehydrateMetadata(state.metadata);
  rehydrateParameters(state.parameters);
  rehydrateUx(state.ux);
};

sagaMiddleware.run(metadataSaga);

export default store;
