/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetFitnessReached: false,
  globalBest: null,
  currentBest: {},
  genStats: [],
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
    addGenStats: (state, action) => {
      state.genStats = [...state.genStats, action.payload];
    },
    clearGenStats: (state) => {
      state.genStats = [];
    },
    updateCurrentGen: (state, action) => {
      const { currentBest, genStats } = action.payload;
      state.currentBest = currentBest;
      state.genStats = [...state.genStats, genStats];
    },
  },
});

export const {
  setGlobalBest,
  setCurrentBest,
  setTargetFitnessReached,
  addGenStats,
  clearGenStats,
  updateCurrentGen,
} = metadataSlice.actions;

export default metadataSlice.reducer;
