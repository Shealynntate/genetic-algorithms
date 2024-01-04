/* eslint-disable no-param-reassign */
import { useLayoutEffect, useState } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../../constants/typeDefinitions';
import { lineColors, MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT } from '../../constants/constants';

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
      let next = indices[0] === 0 ? indices.length % lineColors.length : 0;
      for (let i = 1; i < indices.length; ++i) {
        const prev = indices[i - 1];
        if (indices[i] !== prev && indices[i] - 1 !== prev) {
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

/**
 * A custom hook that returns the dimensions of the window and updates when the window is resized.
 * @returns {Array} An array of the form [width, height]
 */
export const useWindowSize = () => {
  const [size, setSize] = useState([MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export default uxSlice.reducer;
