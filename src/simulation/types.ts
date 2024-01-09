import { type GenerationStats, type Organism } from '../population/types'

export type SimulationStatus = 'unknown' | 'pending' | 'running' | 'paused' | 'complete'

export interface OrganismRecord {
  organism: Organism
  gen: number
}

export interface SimulationState {
  targetFitnessReached: boolean
  globalBest: OrganismRecord | null
  currentBest: OrganismRecord | null
  currentGenStats: GenerationStats | null
  // A record of every fitness threshold passed to be stored in the db at end of the run
  runningStatsRecord: GenerationStats[]
}
