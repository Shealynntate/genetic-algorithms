/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SelectionType } from '../../constants';
// import square from '../../assets/red_square_test.png';
import monaLisa from '../../assets/mona_lisa.jpeg';

const initialState = {
  populationSize: 350,
  mutationRate: 0.002,
  crossoverProbability: 0.1,
  triangleCount: 50,
  target: monaLisa,
  selectionType: SelectionType.TOURNAMENT,
  eliteCount: 0,
};

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.populationSize = action.payload;
    },
    setMutationRate: (state, action) => {
      state.mutationRate = action.payload;
    },
    setCrossoverProbability: (state, action) => {
      state.crossoverProbability = action.payload;
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
  },
});

export const {
  setPopulationSize,
  setMutationRate,
  setCrossoverProbability,
  setTarget,
  setTriangles,
  setSelectionType,
  setEliteCount,
} = parametersSlice.actions;

export default parametersSlice.reducer;
