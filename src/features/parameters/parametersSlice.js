/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { CrossoverType, SelectionType } from '../../constants';
// import defaultTarget from '../../assets/red_square_test.png';
// import defaultTarget from '../../assets/test_grid.png';
import defaultTarget from '../../assets/mona_lisa.jpeg';
import { rehydrate } from '../developer/developerSlice';

const initialState = {
  populationSize: 200,
  triangleCount: 1,
  maxTriangleCount: 50,
  target: defaultTarget,
  crossover: {
    type: CrossoverType.ONE_POINT,
    probMap: [
      {
        threshold: 0,
        values: {
          prob: 0.9,
        },
      },
    ],
  },
  mutation: {
    // Distribution Sigmas
    colorSigma: 0.01, // 0.25 / n
    pointSigma: 0.01,
    permuteSigma: 0.05, // TODO
    probMap: [
      {
        threshold: 0,
        values: {
          // The probability of tweaking a chromosome point or color value
          tweakProb: 0.005,
          addChromosomeProb: 0.02,
          removeChromosomeProb: 0.015,
          resetChromosomeProb: 0.0002,
          permuteProb: 0.005,
          addPointProb: 0.01,
          removePointProb: 0.006,
        },
      },
      {
        threshold: 0.96,
        values: {
          tweakProb: 0.003,
        },
      },
      {
        threshold: 0.97,
        values: {
          tweakProb: 0.0025,
          permuteProb: 0.001,
          addPointProb: 0.001,
          removePointProb: 0.001,
        },
      },
      {
        threshold: 0.975,
        values: {
          tweakProb: 0.0015,
        },
      },
    ],
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
  extraReducers: (builder) => {
    builder
      .addCase(rehydrate, (state, action) => {
        const { parameters } = action.payload;
        Object.keys(parameters).forEach((key) => {
          state[key] = parameters[key];
        });
      });
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
