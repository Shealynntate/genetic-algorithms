import { type PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'

import { type SimulationState } from './types'
import { type Simulation } from '../database/types'
import {
  type OrganismRecord,
  type GenerationStatsRecord
} from '../population/types'

const initialState: SimulationState = {
  targetFitnessReached: false,
  lastThreshold: 0
}

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setGlobalBest: (state, action: PayloadAction<OrganismRecord>) => {
      state.globalBest = action.payload
    },
    setTargetFitnessReached: (state, action: PayloadAction<boolean>) => {
      state.targetFitnessReached = action.payload
    },
    setCurrentGenStats: (
      state,
      action: PayloadAction<GenerationStatsRecord | undefined>
    ) => {
      state.currentGenStats = action.payload
    },
    setLastThreshold: (state, action: PayloadAction<number>) => {
      state.lastThreshold = action.payload
    },
    clearCurrentSimulation: (state) => {
      state.globalBest = undefined
      state.currentGenStats = undefined
      state.targetFitnessReached = false
      state.lastThreshold = 0
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
  setTargetFitnessReached,
  setCurrentGenStats,
  setLastThreshold,
  clearCurrentSimulation
} = simulationSlice.actions

export default simulationSlice.reducer
