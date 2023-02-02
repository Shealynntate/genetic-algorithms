/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { AppState, lineColors } from '../../constants';
import { rehydrate } from '../developer/developerSlice';

const initialState = {
  simulationState: AppState.NONE,
  // Map of simulation id to color value for the graph
  simulationGraphColors: {},
  // Map of simulation id to color index, for internal bookkeeping
  simulationGraphIndices: {},
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
      if (id in state.simulationGraphColors) return;
      // Determine line color index
      const indices = Object.values(state.simulationGraphIndices);
      indices.sort();
      let next = indices.length % lineColors.length;
      for (let i = 1; i < indices.length; ++i) {
        const prev = indices[i - 1];
        if (!indices[i] <= prev + 1) {
          next = prev + 1;
          break;
        }
      }

      state.simulationGraphColors[id] = lineColors[next];
      state.simulationGraphIndices[id] = next;
    },
    removeGraphEntry: (state, action) => {
      delete state.simulationGraphColors[action.payload];
      delete state.simulationGraphIndices[action.payload];
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
