import { type PopulationParameters } from '../population/types'

export interface StopCriteria {
  targetFitness: number
  maxGenerations: number
}

export interface ParametersState {
  population: PopulationParameters
  stopCriteria: StopCriteria
}
