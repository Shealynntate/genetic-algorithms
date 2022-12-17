/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetFitnessReached: false,
  globalBest: null,
  currentBest: {},
  currentStats: {},
};

export const metadataSlice = createSlice({
  name: 'metadata',
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
    rehydrateMetadata: (state, action) => {
      state = action.payload;
    },
  },
});

export const {
  setGlobalBest,
  setCurrentBest,
  setTargetFitnessReached,
  setGenStats,
  clearGenStats,
  updateCurrentGen,
  rehydrateMetadata,
} = metadataSlice.actions;

export default metadataSlice.reducer;
