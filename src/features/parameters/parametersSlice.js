/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { CrossoverType, SelectionType } from '../../constants';
// import defaultTarget from '../../assets/red_square_test.png';
// import defaultTarget from '../../assets/test_grid.png';
import defaultTarget from '../../assets/mona_lisa.jpeg';

const initialState = {
  populationSize: 150,
  triangleCount: 50,
  target: defaultTarget,
  crossover: {
    type: CrossoverType.TWO_POINT,
    prob: 0.6,
  },
  mutation: {
    prob: 0.03, // the probability of mutating DNA [0, 1]
    colorSigma: 0.005, // 0.25 / n
    pointSigma: 0.005,
    permuteProb: 0.01,
  },
  selection: {
    type: SelectionType.TOURNAMENT,
    eliteCount: 0,
    tournamentSize: 2,
  },
};

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.populationSize = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setTriangles: (state, action) => {
      state.triangleCount = action.payload;
    },
    // Crossover
    setCrossoverType: (state, action) => {
      state.crossover.type = action.payload;
    },
    setCrossoverProbability: (state, action) => {
      state.crossover.prob = action.payload;
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.mutation.colorSigma = action.payload;
    },
    setPointSigma: (state, action) => {
      state.mutation.pointSigma = action.payload;
    },
    setPermuteProb: (state, action) => {
      state.mutation.permuteProb = action.payload;
    },
    // Selection
    setSelectionType: (state, action) => {
      state.selection.type = action.payload;
    },
    setEliteCount: (state, action) => {
      const count = action.payload;
      const popSize = state.populationSize;
      if (count > popSize) {
        throw new Error(`Elite count ${count} cannot exceed population size ${popSize}`);
      }
      state.selection.eliteCount = count;
    },
    setTournamentSize: (state, action) => {
      state.selection.tournamentSize = action.payload;
    },
  },
});

export const {
  setPopulationSize,
  setTarget,
  setTriangles,
  setCrossoverType,
  setCrossoverProbability,
  setColorSigma,
  setPointSigma,
  setPermuteProb,
  setSelectionType,
  setEliteCount,
} = parametersSlice.actions;

export default parametersSlice.reducer;
