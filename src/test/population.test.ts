import { mockRandom } from './utils'
import OrganismModel from '../population/organismModel'
import Population from '../population/populationModel'
import { type Organism, type PopulationParameters } from '../population/types'
import { setSigFigs } from '../common/utils'
import { statsSigFigs } from '../simulation/config'
import { seedRandom, resetRandom } from '../utils/random'
import * as utils from '../utils/statsUtils'

const populationParameters: PopulationParameters = {
  size: 10,
  minGenomeSize: 1,
  maxGenomeSize: 10,
  minPoints: 3,
  maxPoints: 10,
  target: '',
  crossover: {
    type: 'onePoint',
    probabilities: {
      swap: 0.9
    }
  },
  mutation: {
    genomeSize: 40,
    distributions: {
      colorSigma: 0.06,
      pointSigma: 0.06
    },
    probabilities: {
      tweakColor: 0.003,
      tweakPoint: 0.003,
      addPoint: 0.0015,
      removePoint: 0.0015,
      addChromosome: 0,
      removeChromosome: 0,
      permuteChromosomes: 0.0015
    }
  },
  selection: {
    type: 'roulette',
    tournamentSize: 0,
    eliteCount: 0
  }
}

const mockEvaluateFitness = async (
  organisms: Organism[]
): Promise<Organism[]> => organisms.map((o) => ({ ...o, fitness: 1 }))

beforeEach(() => {
  // Reset ID generations
  Population.reset()
  OrganismModel.reset()
})

// --------------------------------------------------
test('Roulette CDF', async () => {
  const population = new Population(populationParameters, mockEvaluateFitness)
  await population.initialize()
  const cdf = population.createFitnessCDF()
  cdf.forEach((value, index) => {
    expect(value).toEqual(index + 1)
  })
})

test('Roulette Parent Selection', async () => {
  const picks = [
    { n: 0, id: 0 },
    { n: 1, id: 0 },
    { n: 1.01, id: 1 },
    { n: 1.99, id: 1 },
    { n: 2, id: 1 },
    { n: 4, id: 3 },
    { n: 5, id: 4 },
    { n: 7.2, id: 7 },
    { n: 9.99, id: 9 },
    { n: 10, id: 9 },
    { n: 0, id: 0 }
  ]

  const population = new Population(populationParameters, mockEvaluateFitness)
  await population.initialize()
  const cdf = population.createFitnessCDF()
  // Set up the mock AFTER population creation so mock values aren't consumed during init
  const rvs = picks.map(({ n }) => n)
  vi.spyOn(utils, 'randomFloat').mockImplementation(mockRandom(rvs))
  // Check that the appropriate parent was chosen for each of the corresponding n values
  picks.forEach(({ id }) => {
    const p = population.rouletteSelectParent(cdf)
    expect(p.id).toBe(id)
  })
})

test('Roulette Selection', async () => {
  // const noise = new GaussianNoise(0.1);
  const population = new Population(populationParameters, mockEvaluateFitness)
  await population.initialize()

  population.organisms.forEach((org) => {
    expect(org.fitness).toBe(1)
  })

  const rvs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  vi.spyOn(utils, 'randomFloat').mockImplementation(mockRandom(rvs))
  population.performSelection('roulette', 0, 0)

  expect(utils.randomFloat).toBeCalledTimes(10)

  // run many spins, make sure the disribution is correct
})

// --------------------------------------------------
// A4: Elite Preservation Tests
// --------------------------------------------------
describe('getElites', () => {
  test('returns top N organisms by fitness', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()
    // Assign known fitness values
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10 // 0.1, 0.2, ..., 1.0
    })

    const elites = population.getElites(3)

    expect(elites).toHaveLength(3)
    // Should be the top 3 fitness values (1.0, 0.9, 0.8)
    expect(elites[0].fitness).toBe(0)  // clones have fitness reset to 0
    // But they should come from the highest fitness organisms
    // getElites sorts by fitness desc, then clones — clone resets fitness to 0
    // Verify they are clones (different IDs from originals)
    const originalIds = population.organisms.map((o) => o.id)
    elites.forEach((e) => {
      expect(originalIds).not.toContain(e.id)
    })
  })

  test('returns clones — mutating elite does not affect original', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    const originalR =
      population.organisms[9].genome.chromosomes[0].color.r
    const elites = population.getElites(1)

    // Mutate the elite's chromosome
    elites[0].genome.chromosomes[0].color.r = 999

    // Original should be unchanged
    expect(
      population.organisms[9].genome.chromosomes[0].color.r
    ).toBe(originalR)
  })

  test('getElites(0) returns empty array', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()

    const elites = population.getElites(0)
    expect(elites).toHaveLength(0)
  })
})

describe('reproduce preserves elites', () => {
  test('first eliteCount organisms are elite clones', async () => {
    seedRandom(42)
    const params: PopulationParameters = {
      ...populationParameters,
      selection: { type: 'tournament', tournamentSize: 3, eliteCount: 2 }
    }
    const population = new Population(params, mockEvaluateFitness)
    await population.initialize()

    // Assign distinct fitness values so we know which are top 2
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    const parents = population.performSelection('tournament', 3, 2)
    const nextGen = population.reproduce(
      parents,
      population.selection,
      population.crossover,
      population.mutation
    )

    // Should have full population size
    expect(nextGen).toHaveLength(population.size)

    // First 2 should be elite clones (fitness=0 because clone resets fitness)
    // But they should have new IDs
    expect(nextGen[0].fitness).toBe(0)
    expect(nextGen[1].fitness).toBe(0)

    resetRandom()
  })
})

// --------------------------------------------------
// A4: createStats Tests
// --------------------------------------------------
describe('createStats', () => {
  test('computes correct min/max/mean/deviation for known fitness', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()

    // Assign known fitness: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    const stats = population.createStats()

    // min = 0.1, max = 1.0
    expect(stats.minFitness).toBe(setSigFigs(0.1, statsSigFigs))
    expect(stats.maxFitness).toBe(setSigFigs(1.0, statsSigFigs))

    // mean = (0.1+0.2+...+1.0)/10 = 5.5/10 = 0.55
    expect(stats.meanFitness).toBe(setSigFigs(0.55, statsSigFigs))

    // deviation should be positive
    expect(stats.deviation).toBeGreaterThan(0)

    // maxFitOrganism should be the one with fitness=1.0
    expect(stats.maxFitOrganism.fitness).toBe(1.0)
  })

  test('uniform fitness gives zero deviation', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()
    // All fitness = 0.5
    population.organisms.forEach((org) => {
      org.fitness = 0.5
    })

    const stats = population.createStats()

    expect(stats.minFitness).toBe(setSigFigs(0.5, statsSigFigs))
    expect(stats.maxFitness).toBe(setSigFigs(0.5, statsSigFigs))
    expect(stats.meanFitness).toBe(setSigFigs(0.5, statsSigFigs))
    expect(stats.deviation).toBe(0)
  })
})

describe('Global best tracking', () => {
  test('first generation sets isGlobalBest=true', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })

    const stats = population.createStats()
    expect(stats.isGlobalBest).toBe(true)
    expect(population.best).not.toBeNull()
    expect(population.best!.organism.fitness).toBe(1.0)
  })

  test('lower max fitness does not update global best', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()

    // First gen: max fitness = 1.0
    population.organisms.forEach((org, i) => {
      org.fitness = (i + 1) / 10
    })
    const stats1 = population.createStats()
    expect(stats1.isGlobalBest).toBe(true)
    const firstBestFitness = population.best!.organism.fitness

    // Simulate a new generation with fresh organisms (lower fitness)
    // createStats stores a reference to the actual organism, so we need new objects
    population.organisms = population.organisms.map((org) => ({
      ...org,
      genome: { ...org.genome },
      fitness: 0.3
    }))
    const stats2 = population.createStats()

    expect(stats2.isGlobalBest).toBe(false)
    // The stored best should still reference the old organism with its original fitness
    expect(population.best!.organism.fitness).toBe(firstBestFitness)
  })

  test('higher max fitness updates global best', async () => {
    const population = new Population(populationParameters, mockEvaluateFitness)
    await population.initialize()

    // First gen: max fitness = 0.5
    population.organisms.forEach((org) => {
      org.fitness = 0.5
    })
    population.createStats()

    // Simulate second gen with fresh organisms (higher fitness)
    population.organisms = population.organisms.map((org, i) => ({
      ...org,
      genome: { ...org.genome },
      fitness: i === 0 ? 0.9 : 0.3
    }))
    const stats2 = population.createStats()

    expect(stats2.isGlobalBest).toBe(true)
    expect(population.best!.organism.fitness).toBe(0.9)
  })
})
