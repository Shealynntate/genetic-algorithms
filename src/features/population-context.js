import { createContext } from 'react';
import Population from '../models/population';

class PopulationService {
  constructor() {
    this.population = null;
  }

  async create(params) {
    this.population = new Population(params);
    return this.population.initialize();
  }

  serialize() {
    return this.population.serialize();
  }

  async restore(params) {
    this.population = Population.restorePopulation(params);
    return this.population.initialize();
  }

  reset() {
    Population.reset();
    this.population = null;
  }
}

const populationService = new PopulationService();

export const PopulationContext = createContext(populationService);

export default populationService;
