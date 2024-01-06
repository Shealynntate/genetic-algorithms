import { type SimulationStatus } from '../simulation/types'

export interface ImagesDbEntry {
  id?: number
  genId: number
  simulationId: number
  imageData: string
  chromosomes: string
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

export interface ResultsDbEntry {
  id?: number
  simulationId: number
  createdOn: number
  lastUpdated: number
  results: string
}

export interface GalleryDbEntry {
  id?: number
  createdOn: number
  simulationId: number
  name: string
  json: string
}
