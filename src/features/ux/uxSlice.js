/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../../constants';
import { rehydrate } from '../developer/developerSlice';
import { completeExperiments } from '../experimentation/experimentationSlice';

const initialState = {
  simulationState: AppState.NONE,
};

export const uxSlice = createSlice({
  name: 'ux',
  initialState,
  reducers: {
    setAppState: (state, action) => {
      state.simulationState = action.payload;
    },
    runSimulations: (state) => {
      state.simulationState = AppState.RUNNING;
    },
    pauseSimulations: (state) => {
      state.simulationState = AppState.PAUSED;
    },
    resumeSimulations: (state) => {
      state.simulationState = AppState.RUNNING;
    },
    endSimulations: (state) => {
      state.simulationState = AppState.COMPLETE;
    },
    resetSimulations: (state) => {
      state.simulationState = AppState.NONE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrate, (state, action) => {
        const { ux } = action.payload;
        Object.keys(ux).forEach((key) => {
          state[key] = ux[key];
        });
      })
      .addCase(completeExperiments, (state) => {
        state.simulationState = AppState.COMPLETE_EXPERIMENTS;
      });
  },
});

export const {
  setAppState,
  runSimulations,
  pauseSimulations,
  resumeSimulations,
  endSimulations,
  resetSimulations,
} = uxSlice.actions;

export default uxSlice.reducer;
