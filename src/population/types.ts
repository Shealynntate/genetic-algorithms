import {
  type SelectionType,
  type CrossoverType,
  type CrossoverTypes,
  type CrossoverProbabilityParameters,
  type MutationProbabilityParameters
} from '../parameters/types'

export type Phenotype = ImageData

export interface Chromosome {
  points: number[][]
  color: number[]
}

export interface Genome {
  chromosomes: Chromosome[]
}

// Organism Types
// ------------------------------------------------------------
export interface Organism {
  id: number
  genome: Genome
  fitness: number
  phenotype?: Phenotype
}

/**
 * The input parameters for creating a new Organism model
 */
export interface OrganismParameters {
  id?: number
  size: number
  numSides: number
  genome?: Genome
}

// Mutation
// ------------------------------------------------------------
export interface MutationParameters {
  genomeSize: number
  probabilityParameters: MutationProbabilityParameters
}

// Crossover
// ------------------------------------------------------------
/**
 * Map of CrossoverTypes to probability values
 */
export type CrossoverProbabilities = {
  [key in CrossoverTypes]: number
}

/**
 * The input parameters for creating a new Crossover model
 */
export interface CrossoverParameters {
  type: CrossoverType
  probabilityParameters: CrossoverProbabilityParameters
}

export interface SelectionParameters {
  type: SelectionType
}

export type FitnessEvaluator = (organisms: Organism[]) => Organism[]

/**
 * The parameters needed to create a new Population
 */
export interface PopulationParameters {
  size: number
  minGenomeSize: number
  maxGenomeSize: number
  minPoints: number
  maxPoints: number
  target: string
  mutation: MutationParameters
  crossover: CrossoverParameters
  selection: SelectionParameters
}

/**
 * The parameters needed to restore a Population from a previous run
 */
export interface RestorePopulationParameters extends PopulationParameters {
  genId: number
  organismId: number
  organisms: Organism[]
  best: Organism
}
