import { type SimulationStatus } from '../simulation/types'
import { type Stats, type Genome } from '../population/types'

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
  parameters: string
  population: number
}

export type MutableSimulation = Pick<Simulation, 'population' | 'parameters' | 'status' | 'name'>

export interface Results {
  id?: number
  simulationId: number
  createdOn: number
  lastUpdated: number
  stats: Stats[]
}

export interface GalleryEntry {
  id?: number
  createdOn: number
  simulationId: number
  name: string
  json: string
}

export interface SimulationReport {
  simulation: Simulation
  results: Results
}
