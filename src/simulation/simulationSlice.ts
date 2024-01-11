import { createAction, createSlice } from '@reduxjs/toolkit'
import { type SimulationState } from './types'
import { type Simulation } from '../database/types'

const initialState: SimulationState = {
  targetFitnessReached: false,
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
      state.currentBest = undefined
      state.globalBest = undefined
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

export const restorePopulation = createAction<Simulation>(
  RESTORE_POPULATION
  // (data: Simulation) => ({
  //   type: RESTORE_POPULATION,
  //   payload: data
  // })
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
