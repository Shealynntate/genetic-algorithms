/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { SimulationState } from '../constants';

const initialState = {
  size: 100,
  simulationState: SimulationState.NONE,
  pastGenerations: [],
};

export const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    setPopulationSize: (state, action) => {
      state.size = action.payload;
    },
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
  },
});

export const {
  setPopulation,
  clearPopulation,
  setPopulationSize,
  setSimulationState,
  setSimulationStateToRunning,
  setSimulationStateToPaused,
  setSimulationStateToComplete,
  resetSimulationState,
} = populationSlice.actions;

export default populationSlice.reducer;
