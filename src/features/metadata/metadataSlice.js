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
  eliteCount: 0,
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
    setEliteCount: (state, action) => {
      const count = action.payload;
      const popSize = state.populationSize;
      if (count > popSize) {
        throw new Error(`Elite count ${count} cannot exceed population size ${popSize}`);
      }
      state.eliteCount = count;
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
  setEliteCount,
  setGlobalBest,
  setCurrentGen,
  setTargetFitnessReached,
  setGenealogyTree,
} = metadataSlice.actions;

export default metadataSlice.reducer;
