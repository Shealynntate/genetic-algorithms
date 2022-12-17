import { pickBy, values } from 'lodash';
import * as utils from '../globals/utils';
import { SelectionType } from '../constants';
import GaussianNoise from '../globals/gaussianNoise';
import Population from '../models/population';
import Organism from '../models/organism';

const popSize = 10;

function mockEvaluateFitness() {
  // eslint-disable-next-line no-param-reassign
  this.organisms.forEach((org) => { org.fitness = 1; });
}

beforeEach(() => {
  // Reset ID generations
  Population.count = null;
  Organism.count = null;
});

const mockRandomFloat = (v) => {
  let index = -1;

  return (() => {
    index += 1;
    return v[index];
  });
};

test('Roulette CDF', () => {
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);
  const population = new Population(popSize, 1, null);

  const cdf = population.createFitnessCDF();
  cdf.forEach((value, index) => {
    expect(value).toEqual(index + 1);
  });
});

test('Roulette Parent Selection', () => {
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
  const rvs = values(pickBy(picks, 'n'));
  jest.spyOn(utils, 'randomFloat').mockImplementation(mockRandomFloat(rvs));
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);

  const population = new Population(popSize, 1, null);
  const cdf = population.createFitnessCDF();
  // Check that the appropriate parent was chosen for each of the corresponding n values
  picks.forEach(({ id }) => {
    const p = population.rouletteSelectParent(cdf);
    expect(p.id).toBe(id);
  });
});

test('Roulette Selection', () => {
  const noise = new GaussianNoise(0.1);
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);
  const population = new Population(popSize, 1, null);

  population.organisms.forEach((org) => {
    expect(org.fitness).toBe(1);
  });

  const rvs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  jest.spyOn(utils, 'randomFloat').mockImplementation(mockRandomFloat(rvs));
  population.performSelection(SelectionType.ROULETTE, noise);

  expect(utils.randomFloat).toBeCalledTimes(10);

// run many spins, make sure the disribution is correct
});
