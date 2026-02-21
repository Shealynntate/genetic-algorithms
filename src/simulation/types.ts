import { type Simulation } from '../database/types'
import { type ParametersState } from '../parameters/types'
import { type GenerationStatsRecord, type Organism } from '../population/types'

export type SimulationStatus =
  | 'unknown'
  | 'pending'
  | 'running'
  | 'paused'
  | 'complete'

export interface OrganismRecord {
  organism: Organism
  gen: number
}

export interface SimulationState {
  targetFitnessReached: boolean
  globalBest?: OrganismRecord
  /** The current gen's stats, updated every generation */
  currentGenStats?: GenerationStatsRecord
  /** The last threshold value that was used to store records in the db */
  lastThreshold: number
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

export interface StartSimulationAction {
  payload: Simulation
  type: 'simulation/startSimulation'
}

export const SimulationGraph = {
  title: 'Fitness vs Generations',
  minCheckbox: 'Min',
  meanCheckbox: 'Mean',
  deviationCheckbox: 'σ'
}
