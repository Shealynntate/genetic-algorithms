/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { AppState, lineColors } from '../../constants';
import { rehydrate } from '../developer/developerSlice';

const initialState = {
  simulationState: AppState.NONE,
  simulationGraphEntries: {},
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
    // Graph Entries
    addGraphEntry: (state, action) => {
      const id = action.payload;
      if (id in state.simulationGraphEntries) return;
      // Determine line color index
      const indices = Object.values(state.simulationGraphEntries);
      const len = indices.length;
      indices.sort();
      const next = (len ? indices[len - 1] + 1 : 0) % lineColors.length;
      state.simulationGraphEntries[id] = next;
    },
    removeGraphEntry: (state, action) => {
      delete state.simulationGraphEntries[action.payload];
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
  addGraphEntry,
  removeGraphEntry,
} = uxSlice.actions;

export default uxSlice.reducer;
