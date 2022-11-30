/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SelectionType } from '../../constants';
// import square from '../../assets/red_square_test.png';
import monaLisa from '../../assets/mona_lisa.jpeg';

const initialState = {
  populationSize: 300,
  mutationRate: 0.002,
  triangleCount: 40,
  target: monaLisa,
  selectionType: SelectionType.TOURNAMENT,
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
    setSelectionType: (state, action) => {
      state.selectionType = action.payload;
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
  setSelectionType,
  setGlobalBest,
  setCurrentGen,
  setTargetFitnessReached,
  setGenealogyTree,
} = metadataSlice.actions;

export default metadataSlice.reducer;
