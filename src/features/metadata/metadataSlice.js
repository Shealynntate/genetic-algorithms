/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetFitnessReached: false,
  globalBest: null,
  currentGen: {},
  genealogyTree: [],
  maxFitnessScores: [],
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setGlobalBest: (state, action) => {
      state.globalBest = action.payload;
    },
    setCurrentGen: (state, action) => {
      state.currentGen = action.payload;
    },
    setTargetFitnessReached: (state, action) => {
      state.targetFitnessReached = action.payload;
    },
    setGenealogyTree: (state, action) => {
      state.genealogyTree = action.payload;
    },
    addMaxFitnessScore: (state, action) => {
      state.maxFitnessScores = [...state.maxFitnessScores, action.payload];
    },
    clearMaxFitnessScores: (state) => {
      state.maxFitnessScores = [];
    },
  },
});

export const {
  setGlobalBest,
  setCurrentGen,
  setTargetFitnessReached,
  setGenealogyTree,
  addMaxFitnessScore,
  clearMaxFitnessScores,
} = metadataSlice.actions;

export default metadataSlice.reducer;
