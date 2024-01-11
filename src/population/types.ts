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
  isSinglePoint: boolean
  distributions: DistributionMap
  probabilityParameters: MutationProbabilityParameters
}

export interface Mutation extends MutationParameters {
  // Probability values computed when the population is initialized
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
  eliteCount: number
  tournamentSize: number
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
}

// Chromosome
// ------------------------------------------------------------
export interface ChromosomeParameters {
  numSides: number
}

export interface Chromosome {
  points: number[][]
  color: number[]
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
  mutation: MutationParameters
  crossover: CrossoverParameters
  selection: SelectionParameters
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
