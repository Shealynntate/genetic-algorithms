/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';
import { rehydrate } from '../developer/developerSlice';

const initialState = {
  targetFitnessReached: false,
  globalBest: null,
  currentBest: {},
  currentStats: {},
};

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setGlobalBest: (state, action) => {
      state.globalBest = action.payload;
    },
    setCurrentBest: (state, action) => {
      state.currentBest = action.payload;
    },
    setTargetFitnessReached: (state, action) => {
      state.targetFitnessReached = action.payload;
    },
    setGenStats: (state, action) => {
      state.genStats = action.payload;
    },
    clearGenStats: (state) => {
      state.genStats = [];
    },
    updateCurrentGen: (state, action) => {
      const { currentBest, stats } = action.payload;
      state.currentBest = currentBest;
      state.currentStats = stats;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrate, (state, action) => {
        const { simulation } = action.payload;
        Object.keys(simulation).forEach((key) => {
          state[key] = simulation[key];
        });
      });
  },
});

export const RESTORE_POPULATION = 'simulation/restorePopulation';

export const restorePopulation = createAction(
  RESTORE_POPULATION,
  (data) => ({
    type: RESTORE_POPULATION,
    payload: data,
  }),
);

export const {
  setGlobalBest,
  setCurrentBest,
  setTargetFitnessReached,
  setGenStats,
  clearGenStats,
  updateCurrentGen,
} = simulationSlice.actions;

export default simulationSlice.reducer;
