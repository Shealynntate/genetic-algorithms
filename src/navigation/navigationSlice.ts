import { useLayoutEffect, useState } from 'react'
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type NavigationState } from './types'
import { lineColors, MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT } from '../constants/constants'

const initialState: NavigationState = {
  simulationState: 'none',
  // Map of simulation id to color value for the graph
  simulationGraphColors: new Map(),
  // Map of simulation id to color index, for internal bookkeeping
  simulationGraphIndices: new Map()
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setAppState: (state, action) => {
      state.simulationState = action.payload
    },
    runSimulations: (state) => {
      state.simulationState = 'running'
    },
    pauseSimulations: (state) => {
      state.simulationState = 'paused'
    },
    resumeSimulations: (state) => {
      state.simulationState = 'running'
    },
    endSimulations: (state) => {
      state.simulationState = 'complete'
    },
    endSimulationEarly: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = 'running'
    },
    deleteRunningSimulation: (state) => {
      // This is called from a PAUSED state, resume running to process the next run
      state.simulationState = 'running'
    },
    // Graph Entries
    addGraphEntry: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (id in state.simulationGraphColors) return
      // Determine line color index
      const indices: number[] = Object.values(state.simulationGraphIndices)
      indices.sort((a, b) => a - b)
      let next = indices[0] === 0 ? indices.length % lineColors.length : 0
      for (let i = 1; i < indices.length; ++i) {
        const prev = indices[i - 1]
        if (indices[i] !== prev && indices[i] - 1 !== prev) {
          next = prev + 1
          break
        }
      }
      state.simulationGraphColors.set(id, lineColors[next])
      state.simulationGraphIndices.set(id, next)
    },
    removeGraphEntry: (state, action: PayloadAction<number>) => {
      state.simulationGraphColors.delete(action.payload)
      state.simulationGraphIndices.delete(action.payload)
    }
  }
})

export const {
  setAppState,
  runSimulations,
  pauseSimulations,
  resumeSimulations,
  endSimulations,
  endSimulationEarly,
  deleteRunningSimulation,
  addGraphEntry,
  removeGraphEntry
} = navigationSlice.actions

/**
 * A custom hook that returns the dimensions of the window and updates when the window is resized.
 * @returns {Array} An array of the form [width, height]
 */
export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT])

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()

    return () => { window.removeEventListener('resize', updateSize) }
  }, [])

  return size
}

export default navigationSlice.reducer
