/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SimulationState } from '../../constants';
import { rehydrate } from '../developer/developerSlice';

const initialState = {
  simulationState: SimulationState.NONE,
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
  setSimulationState,
  runSimulation,
  pauseSimulation,
  endSimulation,
  resetSimulation,
} = uxSlice.actions;

export default uxSlice.reducer;
