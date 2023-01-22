/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../../constants';
import { rehydrate } from '../developer/developerSlice';

export const END_SIMULATION_EARLY = 'ux/endSimulationEarly';

const initialState = {
  simulationState: AppState.NONE,
};

export const endSimulationEarly = createAction(
  END_SIMULATION_EARLY,
  () => ({
    type: END_SIMULATION_EARLY,
  }),
);

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
} = uxSlice.actions;

export default uxSlice.reducer;
