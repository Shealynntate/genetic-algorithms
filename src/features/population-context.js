import { createContext } from 'react';
import Population from '../models/population';

class PopulationService {
  constructor() {
    this.population = null;
  }

  async create(params) {
    this.population = new Population(params);
    await this.population.initialize();
    return this.population;
  }

  serialize() {
    return this.population.serialize();
  }

  async restore(params) {
    this.population = Population.restorePopulation(params);
    await this.population.initialize();
    return this.population;
  }

  reset() {
    Population.reset();
    this.population = null;
  }

  getPopulation() {
    return this.population;
  }
}

const populationService = new PopulationService();

export const PopulationContext = createContext(populationService);

export default populationService;
