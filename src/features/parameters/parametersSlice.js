/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  DistributionTypes,
} from '../../constants';
// import defaultTarget from '../../assets/red_square_test.png';
// import defaultTarget from '../../assets/test_grid.png';
import defaultParameters from '../../globals/defaultParameters';
import { rehydrate } from '../developer/developerSlice';

const setAllParameters = (state, action) => {
  const { parameters } = action.payload;
  Object.keys(parameters).forEach((key) => {
    state[key] = parameters[key];
  });
};

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState: defaultParameters,
  reducers: {
    // Population
    setPopulationSize: (state, action) => {
      state.population.size = action.payload;
    },
    setTarget: (state, action) => {
      state.population.target = action.payload;
    },
    setMinPolygons: (state, action) => {
      state.population.minPolygons = action.payload;
    },
    setMaxPolygons: (state, action) => {
      state.population.maxPolyGons = action.payload;
    },
    setPolygons: (state, action) => {
      state.population.minPolygons = action.payload.minPolygons;
      state.population.maxPolyGons = action.payload.maxPolyGons;
    },
    // Crossover
    setCrossoverType: (state, action) => {
      state.crossover.type = action.payload;
    },
    setCrossoverProbabilities: (state, action) => {
      state.crossover.probabilities = { ...state.crossover.probabilities, ...action.payload };
    },
    // Mutation
    setColorSigma: (state, action) => {
      state.mutation[DistributionTypes.COLOR_SIGMA] = action.payload;
    },
    setPointSigma: (state, action) => {
      state.mutation[DistributionTypes.POINT_SIGMA] = action.payload;
    },
    setMutationProbabilities: (state, action) => {
      state.mutation.probabilities = { ...state.mutation.probabilities, ...action.payload };
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
    setSimulationParameters: (state, action) => setAllParameters(state, action),
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrate, setAllParameters);
  },
});

export const {
  setPopulationSize,
  setTarget,
  setMinPolygons,
  setMaxPolygons,
  setPolygons,
  setCrossoverType,
  setCrossoverProbabilities,
  setColorSigma,
  setPointSigma,
  setMutationProbabilities,
  setSelectionType,
  setEliteCount,
  setSimulationParameters,
} = parametersSlice.actions;

export default parametersSlice.reducer;
