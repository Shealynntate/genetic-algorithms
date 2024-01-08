import { createAction, createSlice } from '@reduxjs/toolkit'
import { type SimulationState } from './types'

const initialState: SimulationState = {
  targetFitnessReached: false,
  globalBest: null,
  currentBest: null,
  // The current gen's stats, updated every generation
  currentGenStats: null,
  runningStatsRecord: []
}

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setGlobalBest: (state, action) => {
      state.globalBest = action.payload
    },
    setCurrentBest: (state, action) => {
      state.currentBest = action.payload
    },
    setTargetFitnessReached: (state, action) => {
      state.targetFitnessReached = action.payload
    },
    setCurrentGenStats: (state, action) => {
      state.currentGenStats = action.payload
    },
    addGenStats: (state, action) => {
      state.runningStatsRecord.push(action.payload)
    },
    clearCurrentSimulation: (state) => {
      state.runningStatsRecord = []
      state.currentBest = null
      state.globalBest = null
    },
    // Set both the currentBest and current stats in one call
    updateCurrentGen: (state, action) => {
      const { currentBest, stats } = action.payload
      state.currentBest = currentBest
      state.currentGenStats = stats
    }
  }
})

export const RESTORE_POPULATION = 'simulation/restorePopulation'

export const restorePopulation = createAction(
  RESTORE_POPULATION,
  (data) => ({
    type: RESTORE_POPULATION,
    payload: data
  })
)

export const {
  setGlobalBest,
  setCurrentBest,
  setTargetFitnessReached,
  setCurrentGenStats,
  addGenStats,
  clearCurrentSimulation,
  updateCurrentGen
} = simulationSlice.actions

export default simulationSlice.reducer
