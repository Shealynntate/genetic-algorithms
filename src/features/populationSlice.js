/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  size: 100,
  isRunning: false,
  pastGenerations: [],
};

export const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.size = action.payload;
    },
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
  },
});

export const {
  setPopulation,
  clearPopulation,
  setPopulationSize,
  setIsRunning,
} = populationSlice.actions;

export default populationSlice.reducer;
