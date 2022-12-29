/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';

export const START_EXPERIMENTS = 'experimentation/startExperiments';
export const STOP_EXPERIMENT = 'experimentation/stopExperiment';
export const COMPLETE_EXPERIMENTS = 'experimentation/completeExperiments';

export const startExperiments = createAction(
  START_EXPERIMENTS,
  (experiments) => ({
    type: START_EXPERIMENTS,
    payload: experiments,
  }),
);

export const stopExperiment = createAction(
  STOP_EXPERIMENT,
  (isSuccess) => ({
    type: STOP_EXPERIMENT,
    payload: isSuccess,
  }),
);

export const completeExperiments = createAction(
  COMPLETE_EXPERIMENTS,
  () => ({
    type: COMPLETE_EXPERIMENTS,
  }),
);

const initialState = {
  parameters: {},
  stopCriteria: {},
  results: [],
};

export const experimentationSlice = createSlice({
  name: 'experimentation',
  initialState,
  reducers: {
    setupExperiment: (state, { payload: { parameters, stopCriteria } }) => {
      state.parameters = parameters;
      state.stopCriteria = stopCriteria;
    },
    addResults: (state, action) => {
      state.results = [...state.results, action.payload];
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
});

export const {
  setupExperiment,
  addResults,
  clearResults,
} = experimentationSlice.actions;

export default experimentationSlice.reducer;
