import { configureStore } from '@reduxjs/toolkit';
import mutationReducer from './features/mutationSlice';
import targetReducer from './features/targetSlice';

const store = configureStore({
  reducer: {
    target: targetReducer,
    mutation: mutationReducer,
  },
});

export default store;
