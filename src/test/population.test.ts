import { type Organism, type PopulationParameters } from '../population/types'
import * as utils from '../utils/statsUtils'
// import GaussianNoise from '../utils/gaussianNoise';
import Population from '../population/populationModel'
import { mockRandom } from './utils'
import OrganismModel from '../population/organismModel'

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
