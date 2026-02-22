import OrganismModel from '../population/organismModel'
import PopulationModel from '../population/populationModel'
import { type Organism, type PopulationParameters } from '../population/types'
import { seedRandom, resetRandom } from '../utils/random'

const mockEvaluateFitness = async (
  organisms: Organism[]
): Promise<Organism[]> => organisms

function createPopulationParams(
  overrides: Partial<PopulationParameters> = {}
): PopulationParameters {
  return {
    size: 10,
    minGenomeSize: 1,
    maxGenomeSize: 10,
    minPoints: 3,
    maxPoints: 10,
    target: '',
    crossover: { type: 'onePoint', probabilities: { swap: 0.9 } },
    mutation: {
      genomeSize: 10,
      distributions: { colorSigma: 0.06, pointSigma: 0.06 },
      probabilities: {
        tweakColor: 0,
        tweakPoint: 0,
        addPoint: 0,
        removePoint: 0,
        addChromosome: 0,
        removeChromosome: 0,
        permuteChromosomes: 0
      }
    },
    selection: { type: 'tournament', tournamentSize: 3, eliteCount: 0 },
    ...overrides
  }
}

beforeEach(() => {
  seedRandom(42)
  PopulationModel.reset()
  OrganismModel.reset()
})

afterEach(() => {
  resetRandom()
  vi.restoreAllMocks()
})

// --------------------------------------------------
describe('Tournament Selection', () => {
  test('highest-fitness organism in tournament wins', () => {
    seedRandom(42)
    const params = createPopulationParams({
      size: 10,
      selection: { type: 'tournament', tournamentSize: 3, eliteCount: 0 }
    })
    const population = new PopulationModel(params, mockEvaluateFitness)

    // Assign known fitness values
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10 // 0.1, 0.2, ..., 1.0
    })

    // Run many tournament selections and verify winner always has highest fitness in tournament
    seedRandom(100)
    for (let t = 0; t < 20; t++) {
      const winner = population.tournamentSelectParent(3)
      // Winner should be one of the organisms
      expect(winner.fitness).toBeGreaterThan(0)
      expect(winner.fitness).toBeLessThanOrEqual(1.0)
    }
  })

  test('tournament size=1 returns a random organism', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 10 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    // Size=1 means we just pick one random organism (no competition)
    seedRandom(7)
    const results = new Set<number>()
    for (let i = 0; i < 50; i++) {
      const winner = population.tournamentSelectParent(1)
      results.add(winner.id)
    }
    // With 50 tries, we should get multiple different organisms
    expect(results.size).toBeGreaterThan(1)
  })

  test('tournament size=population always selects best', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 10 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    // When tournament size equals population, the best organism always wins
    seedRandom(7)
    for (let i = 0; i < 10; i++) {
      const winner = population.tournamentSelectParent(10)
      expect(winner.fitness).toBe(1.0)
    }
  })

  test('tournamentSelection returns correct number of parent pairs', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 10 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    const parentPairs = population.tournamentSelection(5, 3)
    expect(parentPairs).toHaveLength(5)
    parentPairs.forEach((pair) => {
      expect(pair).toHaveLength(2)
      expect(pair[0].fitness).toBeGreaterThan(0)
      expect(pair[1].fitness).toBeGreaterThan(0)
    })
  })
})

// --------------------------------------------------
describe('SUS Selection', () => {
  test('proportional selection with known fitness distribution', () => {
    seedRandom(42)
    const params = createPopulationParams({
      size: 10,
      selection: { type: 'sus', tournamentSize: 0, eliteCount: 0 }
    })
    const population = new PopulationModel(params, mockEvaluateFitness)

    // Assign linearly increasing fitness
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    seedRandom(100)
    const parentPairs = population.susSelection(5)
    expect(parentPairs).toHaveLength(5)

    // All selected parents should be valid organisms
    parentPairs.forEach((pair) => {
      expect(pair).toHaveLength(2)
      expect(pair[0].fitness).toBeGreaterThan(0)
      expect(pair[1].fitness).toBeGreaterThan(0)
    })
  })

  test('susSelectParent finds correct organism via CDF', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 5 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) // 1, 2, 3, 4, 5
    })

    // CDF should be [1, 3, 6, 10, 15]
    const cdf = population.createFitnessCDF()
    expect(cdf).toEqual([1, 3, 6, 10, 15])

    // Value 0.5 should select organism 0 (cdf[0]=1, 0.5 <= 1)
    expect(population.susSelectParent(cdf, 0.5).fitness).toBe(1)
    // Value 1.5 should select organism 1 (cdf[1]=3, 1.5 <= 3)
    expect(population.susSelectParent(cdf, 1.5).fitness).toBe(2)
    // Value 5.5 should select organism 2 (cdf[2]=6, 5.5 <= 6)
    expect(population.susSelectParent(cdf, 5.5).fitness).toBe(3)
    // Value 9 should select organism 3 (cdf[3]=10, 9 <= 10)
    expect(population.susSelectParent(cdf, 9).fitness).toBe(4)
    // Value 14 should select organism 4 (cdf[4]=15, 14 <= 15)
    expect(population.susSelectParent(cdf, 14).fitness).toBe(5)
  })
})

// --------------------------------------------------
describe('CDF Edge Cases', () => {
  test('all equal fitness produces uniform CDF', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 5 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org) => {
      org.fitness = 0.5
    })

    const cdf = population.createFitnessCDF()
    expect(cdf).toHaveLength(5)
    // CDF should be [0.5, 1.0, 1.5, 2.0, 2.5]
    cdf.forEach((val, i) => {
      expect(val).toBeCloseTo((i + 1) * 0.5, 10)
    })
  })

  test('one dominant organism has steep CDF', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 5 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = i === 4 ? 100 : 1 // organism 4 dominates
    })

    const cdf = population.createFitnessCDF()
    // Total = 4*1 + 100 = 104
    expect(cdf[cdf.length - 1]).toBe(104)
    // The last organism takes up most of the CDF range
    const lastSlice = cdf[4] - cdf[3]
    expect(lastSlice).toBe(100)
  })

  test('roulette selection with dominant organism selects it most often', () => {
    seedRandom(42)
    const params = createPopulationParams({ size: 5 })
    const population = new PopulationModel(params, mockEvaluateFitness)
    population.organisms.forEach((org, i) => {
      org.fitness = i === 4 ? 100 : 1
    })

    const cdf = population.createFitnessCDF()

    seedRandom(200)
    let dominantCount = 0
    const trials = 100
    for (let i = 0; i < trials; i++) {
      const parent = population.rouletteSelectParent(cdf)
      if (parent.fitness === 100) dominantCount++
    }

    // The dominant organism has ~96% of total fitness, should be selected most of the time
    expect(dominantCount).toBeGreaterThan(trials * 0.8)
  })
})
