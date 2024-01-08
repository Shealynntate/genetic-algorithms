import {
  type Population,
  type Selection,
  type Crossover,
  type Mutation
} from '../population/types'

export interface StopCriteria {
  targetFitness: number
  maxGenerations: number
}

export interface ParametersState {
  population: Population
  selection: Selection
  crossover: Crossover
  mutation: Mutation
  stopCriteria: StopCriteria
}
