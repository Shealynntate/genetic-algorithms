// Mutation
// ------------------------------------------------------------
export type DistributionTypes = 'colorSigma' | 'pointSigma'

export type DistributionMap = {
  [key in DistributionTypes]: number
}

export const mutationProbabilityTypes = [
  'tweakPoint', 'tweakColor', 'addPoint', 'removePoint', 'addChromosome',
  'removeChromosome', 'permuteChromosomes'
] as const

export type MutationProbabilityType = typeof mutationProbabilityTypes[number]

export type MutationProbabilities = {
  [key in MutationProbabilityType]: number
}

export interface Mutation {
  genomeSize: number
  distributions: DistributionMap
  probabilities: MutationProbabilities
}

// Crossover
// ------------------------------------------------------------
export type CrossoverType = 'onePoint' | 'twoPoint' | 'uniform'

export type CrossoverProbabilityTypes = 'swap'

/**
 * Map of CrossoverTypes to probability values
 */
export type CrossoverProbabilities = {
  [key in CrossoverProbabilityTypes]: number
}

/**
 * The input parameters for creating a new Crossover model
 */
export interface Crossover {
  type: CrossoverType
  probabilities: CrossoverProbabilities
}

// Selection
// ------------------------------------------------------------
export type SelectionType = 'roulette' | 'tournament' | 'sus'

export interface Selection {
  type: SelectionType
  eliteCount: number
  tournamentSize: number
}

// Organism Types
// ------------------------------------------------------------
export interface Organism {
  id: number
  genome: Genome
  fitness: number
}

/**
 * The input parameters for creating a new Organism model
 */
export interface OrganismParameters {
  id?: number
  size: number
  numSides: number
}

// Chromosome
// ------------------------------------------------------------
export interface Point {
  x: number
  y: number
}

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

export interface ChromosomeParameters {
  numSides: number
}

export interface Chromosome {
  points: Point[]
  color: Color
}

// Genome
// ------------------------------------------------------------
export interface GenomeBounds {
  maxGenomeSize: number
  minPoints: number
  maxPoints: number
}

export interface GenomeParameters {
  size: number
  numSides: number
}

export interface Genome {
  chromosomes: Chromosome[]
}

// ------------------------------------------------------------
export type Phenotype = ImageData

export interface OrganismRecord {
  organism: Organism
  gen: number
}

export type FitnessEvaluator = (organisms: Organism[]) => Promise<Organism[]>

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
  mutation: Mutation
  crossover: Crossover
  selection: Selection
}

export interface RestorePopulationParameters {
  genId: number
  organismId: number
  organisms: Organism[]
  best: OrganismRecord
}

/**
 * The parameters needed to restore a Population from a previous run
 */
export interface Population {
  genId: number
  organismId: number
  size: number
  minPoints: number
  maxPoints: number
  target: string
  organisms: Organism[]
  best: OrganismRecord
  mutation: Mutation
  crossover: Crossover
  selection: Selection
}

// Workers
// ------------------------------------------------------------
export interface WorkerMessage {
  updatedOrganisms: Organism[]
}

/**
 * The performance statistics for a generation.
 */
export interface GenerationStats {
  deviation: number
  gen: number
  isGlobalBest: boolean
  maxFitness: number
  minFitness: number
  meanFitness: number
  maxFitOrganism: Organism
}

/**
 * For storing the stats of a generation in the database and in redux
 */
export interface GenerationStatsRecord {
  threshold: number
  stats: GenerationStats
}
