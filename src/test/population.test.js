import * as utils from '../utils/statsUtils';
import {
  CrossoverType,
  DistributionTypes,
  ProbabilityTypes,
  SelectionType,
} from '../constants/typeDefinitions';
// import GaussianNoise from '../utils/gaussianNoise';
import Population from '../models/population';
import Organism from '../models/organism';
import { mockRandom } from './utils';

const targetFitness = 1;
const populationParameters = {
  size: 10,
  minGenomeSize: 1,
  maxGenomeSize: 10,
  minPoints: 3,
  maxPoints: 10,
  target: '',
  crossover: {
    type: CrossoverType.ONE_POINT,
    probabilities: {
      [ProbabilityTypes.SWAP]: {
        startValue: 0.9,
        endValue: 0.9,
        startFitness: 0,
        endFitness: targetFitness,
      },
    },
  },
  mutation: {
    isSinglePoint: true,
    [DistributionTypes.COLOR_SIGMA]: 0.06,
    [DistributionTypes.POINT_SIGMA]: 0.06,
    [DistributionTypes.PERMUTE_SIGMA]: 0.05,
    probabilities: {
      [ProbabilityTypes.TWEAK]: {
        startValue: 0.04,
        endValue: 0.04,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.TWEAK_COLOR]: {
        startValue: 0.01,
        endValue: 0.003,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.TWEAK_POINT]: {
        startValue: 0.01,
        endValue: 0.003,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_POINT]: {
        startValue: 0.0015,
        endValue: 0.0015,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        startValue: 0.0015,
        endValue: 0.0015,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_CHROMOSOME]: {
        startValue: 0,
        endValue: 0,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_CHROMOSOME]: {
        startValue: 0,
        endValue: 0,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.RESET_CHROMOSOME]: {
        startValue: 0.0006,
        endValue: 0.0006,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        startValue: 0.0015,
        endValue: 0.0015,
        startFitness: 0,
        endFitness: targetFitness,
      },
    },
  },
  selection: {},
};

const mockEvaluateFitness = async (organisms) => organisms.map((o) => ({ ...o, fitness: 1 }));

beforeEach(() => {
  // Reset ID generations
  Population.reset();
  Organism.reset();
});

// --------------------------------------------------
test('Roulette CDF', async () => {
  const population = new Population(populationParameters, mockEvaluateFitness);
  await population.initialize();
  const cdf = population.createFitnessCDF();
  cdf.forEach((value, index) => {
    expect(value).toEqual(index + 1);
  });
});

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
    { n: 0, id: 0 },
  ];
  // Extract the "random" values and feed them into the mock randomFloat function
  const rvs = picks.map(({ n }) => n);
  jest.spyOn(utils, 'randomFloat').mockImplementation(mockRandom(rvs));

  const population = new Population(populationParameters, mockEvaluateFitness);
  await population.initialize();
  const cdf = population.createFitnessCDF();
  // Check that the appropriate parent was chosen for each of the corresponding n values
  picks.forEach(({ id }) => {
    const p = population.rouletteSelectParent(cdf);
    expect(p.id).toBe(id);
  });
});

test('Roulette Selection', async () => {
  // const noise = new GaussianNoise(0.1);
  const population = new Population(populationParameters, mockEvaluateFitness);
  await population.initialize();

  population.organisms.forEach((org) => {
    expect(org.fitness).toBe(1);
  });

  const rvs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  jest.spyOn(utils, 'randomFloat').mockImplementation(mockRandom(rvs));
  population.performSelection({
    type: SelectionType.ROULETTE,
    tournamentSize: 0,
    eliteCount: 0,
  });

  expect(utils.randomFloat).toBeCalledTimes(10);

// run many spins, make sure the disribution is correct
});
