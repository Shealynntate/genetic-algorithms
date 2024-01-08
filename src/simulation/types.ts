import { type Organism } from '../population/types'
import { type Stats } from '../database/types'

export type SimulationStatus = 'unknown' | 'pending' | 'running' | 'paused' | 'complete'

export interface GlobalBest {
  organism: Organism
  genId: number
}

export interface SimulationState {
  targetFitnessReached: boolean
  globalBest: GlobalBest | null
  currentBest: Organism | null
  currentGenStats: Stats | null
  // A record of every fitness threshold passed to be stored in the db at end of the run
  runningStatsRecord: Stats[]
}
