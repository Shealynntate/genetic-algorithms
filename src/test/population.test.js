import * as utils from '../globals/utils';
import { SelectionType } from '../constants';
import RandomNoise from '../globals/randomNoise';
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

const mockRandomFloat = (values) => {
  let index = -1;

  return (() => {
    index += 1;
    return values[index];
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
  const values = [0, 1, 1.5, 7.2, 10];
  jest.spyOn(utils, 'randomFloat').mockImplementation(mockRandomFloat(values));
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);

  const population = new Population(popSize, 1, null);
  const cdf = population.createFitnessCDF();

  const p1 = population.rouletteSelectParent(cdf);
  expect(p1.id).toBe(0);
  const p2 = population.rouletteSelectParent(cdf);
  expect(p2.id).toBe(0);
  const p3 = population.rouletteSelectParent(cdf);
  expect(p3.id).toBe(1);
  const p4 = population.rouletteSelectParent(cdf);
  expect(p4.id).toBe(7);
  const p5 = population.rouletteSelectParent(cdf);
  expect(p5.id).toBe(9);
});

test('Roulette Selection', () => {
  const noise = new RandomNoise(0.1);
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);
  const population = new Population(popSize, 1, null);

  population.organisms.forEach((org) => {
    expect(org.fitness).toBe(1);
  });

  jest.spyOn(utils, 'randomFloat').mockImplementation(() => { return 0; });
  population.performSelection(SelectionType.ROULETTE, noise);

  expect(utils.randomFloat).toBeCalledTimes(10);

// run many spins, make sure the disribution is correct
});
