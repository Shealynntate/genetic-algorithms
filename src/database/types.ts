import { type SimulationStatus } from '../simulation/types'
import { type GenerationStatsRecord, type Genome, type Population } from '../population/types'
import { type ParametersState } from '../parameters/types'

export interface Image {
  id?: number
  gen: number
  simulationId: number
  imageData?: ImageData
  genome: Genome
  fitness: number
}

export interface Simulation {
  id?: number
  createdOn: number
  status: SimulationStatus
  name: string
  lastUpdated: number
  parameters: ParametersState
  population?: Population
}

export type MutableSimulation = Pick<Simulation, 'population' | 'parameters' | 'status' | 'name'>

export interface Results {
  id?: number
  simulationId: number
  createdOn: number
  lastUpdated: number
  stats: GenerationStatsRecord[]
}

export interface SimulationReport {
  simulation: Simulation
  results: Results
}
