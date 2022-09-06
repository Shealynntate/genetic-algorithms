import { configureStore } from '@reduxjs/toolkit';
import mutationReducer from './features/mutationSlice';
import targetReducer from './features/targetSlice';
import generationReducer from './features/generationSlice';

const store = configureStore({
  reducer: {
    target: targetReducer,
    mutation: mutationReducer,
    generation: generationReducer,
  },
});

export default store;
