import { type ParametersState } from '../parameters/types'
import {
  type GenerationStatsRecord,
  type Genome,
  type Population
} from '../population/types'
import { type SimulationStatus } from '../simulation/types'

/**
 * Data stored in the images IndexedDB table
 */
export interface Image {
  id?: number
  gen: number
  simulationId: number
  imageData?: ImageData
  genome: Genome
  fitness: number
}

/**
 * Data stored in the simulations IndexedDB table
 */
export interface Simulation {
  id?: number
  createdOn: number
  status: SimulationStatus
  name: string
  lastUpdated: number
  parameters: ParametersState
  population?: Population
}

/**
 * Data stored in the results IndexedDB table
 */
export interface Results {
  id?: number
  simulationId: number
  createdOn: number
  stats: GenerationStatsRecord
}

/**
 * Data stored in the gifs IndexedDB table
 */
export interface Gif {
  id?: number
  simulationId: number
  createdOn: number
  gif: string // base64 encoded gif
}

/**
 * The full report of a simulation
 */
export interface SimulationReport {
  simulation: Simulation
  results: GenerationStatsRecord[] // The combined records from all generations
  gif?: string // The base64 encoded gif
}

export type MutableSimulation = Pick<
  Simulation,
  'population' | 'parameters' | 'status' | 'name'
>
