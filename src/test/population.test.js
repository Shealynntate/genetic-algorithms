import * as utils from '../globals/utils';
import { SelectionType } from '../constants';
import RandomNoise from '../globals/randomNoise';
import Population from '../models/population';

function mockEvaluateFitness() {
  // eslint-disable-next-line no-param-reassign
  this.organisms.forEach((org) => { org.fitness = 1; });
}

test('Roulette Selection', () => {
  const popSize = 10;
  const noise = new RandomNoise(0.1);
  jest.spyOn(Population.prototype, 'evaluateFitness').mockImplementation(mockEvaluateFitness);
  const population = new Population(popSize, 1, null);

  population.organisms.forEach((org) => {
    expect(org.fitness).toBe(1);
  });

  jest.spyOn(utils, 'randomFloat').mockImplementation(() => { return 0; });
  population.performSelection(SelectionType.ROULETTE, noise);

  expect(utils.randomFloat).toBeCalledTimes(10);
  // inject n = 0.5 - make sure parent 1 is chosen
  // inject n = 5 - make sure right parent
  // inject n = 10 - make sure parent is chosen

// run many spins, make sure the disribution is correct
});
