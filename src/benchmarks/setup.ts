import CrossoverModel from '../population/crossoverModel'
import MutationModel from '../population/mutationModel'
import OrganismModel from '../population/organismModel'
import PopulationModel from '../population/populationModel'
import {
  type Organism,
  type PopulationParameters,
  type FitnessEvaluator
} from '../population/types'
import { seedRandom, resetRandom } from '../utils/random'

/**
 * A fitness evaluator that assigns deterministic fitness values (no canvas needed).
 * Fitness is based on organism id to create variance for selection benchmarks.
 */
export const mockFitnessEvaluator: FitnessEvaluator = async (
  organisms: Organism[]
): Promise<Organism[]> =>
  organisms.map((o, i) => ({
    ...o,
    fitness: (i + 1) / organisms.length
  }))

/**
 * Creates benchmark population parameters with the given overrides.
 */
export function createBenchmarkParams(
  overrides: Partial<PopulationParameters> = {}
): PopulationParameters {
  return {
    size: 100,
    minGenomeSize: 1,
    maxGenomeSize: 50,
    minPoints: 3,
    maxPoints: 10,
    target: '',
    selection: {
      type: 'tournament',
      eliteCount: 2,
      tournamentSize: 3
    },
    crossover: {
      type: 'twoPoint',
      probabilities: { swap: 0.9 }
    },
    mutation: {
      genomeSize: 50,
      distributions: { colorSigma: 0.1, pointSigma: 0.1 },
      probabilities: {
        tweakColor: 0.003,
        tweakPoint: 0.003,
        addPoint: 0.0015,
        removePoint: 0.0015,
        addChromosome: 0.001,
        removeChromosome: 0.001,
        permuteChromosomes: 0.0015
      }
    },
    ...overrides
  }
}

/**
 * Seeds the PRNG and resets static counters for reproducible benchmarks.
 */
export function setupBenchmark(seed = 42): void {
  seedRandom(seed)
  PopulationModel.reset()
  OrganismModel.reset()
}

/**
 * Resets the PRNG and static counters after benchmarks.
 */
export function teardownBenchmark(): void {
  resetRandom()
  PopulationModel.reset()
  OrganismModel.reset()
}

/**
 * Creates a pre-initialized population ready for benchmarking.
 */
export async function createBenchmarkPopulation(
  overrides: Partial<PopulationParameters> = {}
): Promise<PopulationModel> {
  const params = createBenchmarkParams(overrides)
  const population = new PopulationModel(params, mockFitnessEvaluator)
  await population.initialize()
  return population
}

/**
 * Creates model instances for operator-level benchmarks.
 */
export function createOperatorModels(params?: PopulationParameters): {
  crossover: CrossoverModel
  mutation: MutationModel
} {
  const p = params ?? createBenchmarkParams()
  return {
    crossover: new CrossoverModel(p.crossover),
    mutation: new MutationModel(p.mutation)
  }
}
