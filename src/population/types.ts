/**
 * The boundaries used to compute the probability of an event
 */
export interface ProbabilityParameters {
  startValue: number
  endValue: number
  startFitness: number
  endFitness: number
}

// Mutation
// ------------------------------------------------------------
export type DistributionTypes = 'colorSigma' | 'pointSigma' | 'permuteSigma'

export type DistributionMap = {
  [key in DistributionTypes]: number
}

export type MutationProbabilityTypes =
  'tweak' |
  'tweakPoint' |
  'tweakColor' |
  'addPoint' |
  'removePoint' |
  'addChromosome' |
  'removeChromosome' |
  'resetChromosome' |
  'permuteChromosomes'

export type MutationProbabilityParameters = {
  [key in MutationProbabilityTypes]: ProbabilityParameters
}

export type MutationProbabilities = {
  [key in MutationProbabilityTypes]: number
}

export interface MutationParameters {
  genomeSize: number
  probabilityParameters: MutationProbabilityParameters
  distributionSigma: DistributionMap
  isSinglePoint: boolean
}

export interface Mutation {
  isSinglePoint: boolean
  distributions: DistributionMap
  probabilityParameters: MutationProbabilityParameters
  probabilities: MutationProbabilities
}

// Crossover
// ------------------------------------------------------------
export type CrossoverType = 'onePoint' | 'twoPoint' | 'uniform'

export type CrossoverProbabilityTypes = 'swap'

export type CrossoverProbabilityParameters = {
  [key in CrossoverProbabilityTypes]: ProbabilityParameters
}

/**
 * Map of CrossoverTypes to probability values
 */
export type CrossoverProbabilities = {
  [key in CrossoverProbabilityTypes]: number
}

/**
 * The input parameters for creating a new Crossover model
 */
export interface CrossoverParameters {
  type: CrossoverType
  probabilityParameters: CrossoverProbabilityParameters
}

export interface Crossover {
  type: CrossoverType
  probabilityParameters: CrossoverProbabilityParameters
  probabilities: CrossoverProbabilities
}

// Selection
// ------------------------------------------------------------
export type SelectionType = 'roulette' | 'tournament' | 'sus'

export interface SelectionParameters {
  type: SelectionType
}

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

export interface Chromosome {
  points: number[][]
  color: number[]
}

export interface Genome {
  chromosomes: Chromosome[]
}

export type Phenotype = ImageData

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

export interface Population {
  size: number
  minPolygons: number
  maxPolygons: number
  minPoints: number
  maxPoints: number
  target: string
}
