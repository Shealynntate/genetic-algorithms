/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SimulationState } from '../constants';

const initialState = {
  simulationState: SimulationState.NONE,
  selectedGeneration: null,
};

export const uxSlice = createSlice({
  name: 'ux',
  initialState,
  reducers: {
    setSimulationState: (state, action) => {
      state.simulationState = action.payload;
    },
    setSimulationStateToRunning: (state) => {
      state.simulationState = SimulationState.RUNNING;
    },
    setSimulationStateToPaused: (state) => {
      state.simulationState = SimulationState.PAUSED;
    },
    setSimulationStateToComplete: (state) => {
      state.simulationState = SimulationState.COMPLETE;
    },
    resetSimulationState: (state) => {
      state.simulationState = SimulationState.NONE;
    },
    setGeneration: (state, action) => {
      state.selectedGeneration = action.payload;
    },
  },
});

export const {
  setSimulationState,
  setSimulationStateToRunning,
  setSimulationStateToPaused,
  setSimulationStateToComplete,
  resetSimulationState,
  setGeneration,
} = uxSlice.actions;

export default uxSlice.reducer;
