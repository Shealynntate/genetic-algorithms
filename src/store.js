import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import metadataReducer from './features/metadata/metadataSlice';
import metadataSaga from './features/metadata/saga';
import uxReducer from './features/uxSlice';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    ux: uxReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(metadataSaga);

export default store;
