import {
  type PopulationParameters,
  type SelectionParameters,
  type CrossoverParameters,
  type MutationParameters
} from '../population/types'

export interface StopCriteria {
  targetFitness: number
  maxGenerations: number
}

export interface ParametersState {
  population: PopulationParameters
  selection: SelectionParameters
  crossover: CrossoverParameters
  mutation: MutationParameters
  stopCriteria: StopCriteria
  minPolygons: number
  maxPolygons: number
}
