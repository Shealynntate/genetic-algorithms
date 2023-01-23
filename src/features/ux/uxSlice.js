/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../../constants';
import { rehydrate } from '../developer/developerSlice';

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
    endSimulationEarly: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = AppState.RUNNING;
    },
    deleteRunningSimulation: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = AppState.RUNNING;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrate, (state, action) => {
        const { ux } = action.payload;
        Object.keys(ux).forEach((key) => {
          state[key] = ux[key];
        });
      });
  },
});

export const {
  setAppState,
  runSimulations,
  pauseSimulations,
  resumeSimulations,
  endSimulations,
  endSimulationEarly,
  deleteRunningSimulation,
} = uxSlice.actions;

export default uxSlice.reducer;
