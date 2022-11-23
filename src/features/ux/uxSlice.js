/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SimulationState } from '../../constants';

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
    runSimulation: (state) => {
      state.simulationState = SimulationState.RUNNING;
    },
    pauseSimulation: (state) => {
      state.simulationState = SimulationState.PAUSED;
    },
    endSimulation: (state) => {
      state.simulationState = SimulationState.COMPLETE;
    },
    resetSimulation: (state) => {
      state.simulationState = SimulationState.NONE;
    },
    setGeneration: (state, action) => {
      state.selectedGeneration = action.payload;
    },
  },
});

export const {
  setSimulationState,
  runSimulation,
  pauseSimulation,
  endSimulation,
  resetSimulation,
  setGeneration,
} = uxSlice.actions;

export default uxSlice.reducer;
