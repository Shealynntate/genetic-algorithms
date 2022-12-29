/* eslint-disable no-param-reassign */
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { CrossoverType, MutationProbabilityTypes, SelectionType } from '../../constants';
// import defaultTarget from '../../assets/red_square_test.png';
// import defaultTarget from '../../assets/test_grid.png';
import defaultTarget from '../../assets/mona_lisa.jpeg';
import { rehydrate } from '../developer/developerSlice';
import { setupExperiment } from '../experimentation/experimentationSlice';

const TERMINATING_FITNESS = 1;

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
    probMap: {
      [MutationProbabilityTypes.TWEAK]: {
        startValue: 0.01,
        endValue: 0.004,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.ADD_POINT]: {
        startValue: 0.01,
        endValue: 0.002,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.REMOVE_POINT]: {
        startValue: 0.002,
        endValue: 0.002,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.ADD_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.003,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.REMOVE_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.003,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.RESET_CHROMOSOME]: {
        startValue: 0.0001,
        endValue: 0.0003,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        startValue: 0.01,
        endValue: 0.005,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
    },
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
    setCrossoverProbMap: (state, action) => {
      state.crossover.probMap = { ...state.crossover.probMap, ...action.payload };
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.mutation.colorSigma = action.payload;
    },
    setPointSigma: (state, action) => {
      state.mutation.pointSigma = action.payload;
    },
    setMutationProbMap: (state, action) => {
      state.mutation.probMap = { ...state.mutation.probMap, ...action.payload };
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
      .addMatcher(isAnyOf(rehydrate, setupExperiment), (state, action) => {
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
  setCrossoverProbMap,
  setColorSigma,
  setPointSigma,
  setMutationProbMap,
  setSelectionType,
  setEliteCount,
} = parametersSlice.actions;

export default parametersSlice.reducer;
