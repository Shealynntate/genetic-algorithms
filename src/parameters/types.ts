import { type CrossoverProbabilities } from '../population/types'

export type SelectionType = 'roulette' | 'tournament' | 'sus'

export type CrossoverType = 'onePoint' | 'twoPoint' | 'uniform'

// Mutation Probabilities
export type MutationTypes =
  'tweak' |
  'tweakPoint' |
  'tweakColor' |
  'addPoint' |
  'removePoint' |
  'addChromosome' |
  'removeChromosome' |
  'resetChromosome' |
  'permuteChromosomes'

// Crossover Probabilities
export type CrossoverTypes = 'swap'

// Mutation Distribution Parameters
export type DistributionTypes = 'colorSigma' | 'pointSigma' | 'permuteSigma'

export interface Population {
  size: number
  minPolygons: number
  maxPolygons: number
  minPoints: number
  maxPoints: number
  target: string
}

export interface Selection {
  type: SelectionType
  eliteCount: number
  tournamentSize: number
}

/**
 * The boundaries used to compute the probability of an event
 */
export interface ProbabilityParameters {
  startValue: number
  endValue: number
  startFitness: number
  endFitness: number
}

export type MutationProbabilityParameters = {
  [key in MutationTypes]: ProbabilityParameters
}

export type CrossoverProbabilityParameters = {
  [key in CrossoverTypes]: ProbabilityParameters
}

export interface Crossover {
  type: CrossoverType
  probabilityParameters: CrossoverProbabilityParameters
  probabilities: CrossoverProbabilities
}

export type DistributionMap = {
  [key in DistributionTypes]: number
}

export interface Mutation {
  isSinglePoint: boolean
  distributions: DistributionMap
  probabilityParameters: MutationProbabilityParameters
}

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
