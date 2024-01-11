import { type Simulation } from '../database/types'
import { type ParametersState } from '../parameters/types'
import { type GenerationStatsRecord, type Organism } from '../population/types'

export type SimulationStatus = 'unknown' | 'pending' | 'running' | 'paused' | 'complete'

export interface OrganismRecord {
  organism: Organism
  gen: number
}

export interface SimulationState {
  targetFitnessReached: boolean
  globalBest?: OrganismRecord
  currentBest?: OrganismRecord
  // The current gen's stats, updated every generation
  currentGenStats?: GenerationStatsRecord
  // A record of every fitness threshold passed to be stored in the db at end of the run
  runningStatsRecord: GenerationStatsRecord[]
}

// Action Types
// ------------------------------------------------------------
export interface ClearCurrentSimulationAction {
  payload: undefined
  type: 'simulation/clearCurrentSimulation'
}

export interface SetSimulationParametersAction {
  payload: ParametersState
  type: 'parameters/setSimulationParameters'
}

export interface EndSimulationsAction {
  payload: undefined
  type: 'navigation/endSimulations'
}

export interface RestoreSimulationAction {
  payload: Simulation
  type: 'simulation/restorePopulation'
}
