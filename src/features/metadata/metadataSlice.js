/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import square from '../../assets/red_square_test.png';

const initialState = {
  populationSize: 200,
  mutationRate: 0.02,
  triangleCount: 2,
  target: square,
  targetFitnessReached: false,
  globalBest: null,
  currentGen: {},
  genealogyTree: [],
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.populationSize = action.payload;
    },
    setMutationRate: (state, action) => {
      state.mutationRate = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setTriangles: (state, action) => {
      state.triangleCount = action.payload;
    },
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
  },
});

export const {
  setMutationRate,
  setPopulationSize,
  setTarget,
  setTriangles,
  setGlobalBest,
  setCurrentGen,
  setTargetFitnessReached,
  setGenealogyTree,
} = metadataSlice.actions;

export default metadataSlice.reducer;
