import { createAction, createSlice } from '@reduxjs/toolkit'
import { type SimulationState } from './types'
import { type Simulation } from '../database/types'

const initialState: SimulationState = {
  targetFitnessReached: false,
  lastThreshold: 0
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
    setLastThreshold: (state, action) => {
      state.lastThreshold = action.payload
    },
    clearCurrentSimulation: (state) => {
      state.currentBest = undefined
      state.globalBest = undefined
      state.currentGenStats = undefined
      state.targetFitnessReached = false
      state.lastThreshold = 0
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
  setLastThreshold,
  clearCurrentSimulation,
  updateCurrentGen
} = simulationSlice.actions

export default simulationSlice.reducer
