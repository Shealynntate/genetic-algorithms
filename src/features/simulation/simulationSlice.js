/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';

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
    rehydrateSimulation: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
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
  rehydrateSimulation,
} = simulationSlice.actions;

export default simulationSlice.reducer;
