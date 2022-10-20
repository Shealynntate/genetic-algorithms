import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './features/metadataSlice';
import uxReducer from './features/uxSlice';

const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    ux: uxReducer,
  },
});

export default store;
