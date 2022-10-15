import { configureStore } from '@reduxjs/toolkit';
import mutationReducer from './features/mutationSlice';
import targetReducer from './features/targetSlice';
import populationReducer from './features/populationSlice';
import generationReducer from './features/generationSlice';

const store = configureStore({
  reducer: {
    target: targetReducer,
    mutation: mutationReducer,
    population: populationReducer,
    selectedGeneration: generationReducer,
  },
});

export default store;
