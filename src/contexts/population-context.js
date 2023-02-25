import { createContext } from 'react';
import { workerBatchSize } from '../constants/constants';
import createWorker from '../web-workers/fitnessEvaluatorCreator';
import Population from '../models/population';

/**
 * A class that serves as the interface between the App and the Population
 * and other GA model code that's designed to be platform agnostic.
 * This service has methods for creating, destroying, and running a Population.
 * It also manages the webWorker code for parallelizing the fitnessEvaluation work.
 */
class PopulationService {
  constructor() {
    this.population = null;
    this.workers = [];
  }

  async create(params) {
    const { size, target } = params;
    // Setup web workers for evaluateFitness work
    const numWorkers = Math.ceil(size / workerBatchSize);
    this.workers = [...Array(numWorkers)].map(() => createWorker(target));
    this.population = new Population(params, this.evaluateFitness.bind(this));
    await this.population.initialize();
    // create webWorkers
    return this.population;
  }

  async restore(params) {
    this.population = Population.restorePopulation(params);
    await this.population.initialize();
    return this.population;
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns the array of evaluated Organisms
   */
  async evaluateFitness(organisms) {
    const size = organisms.length;
    const promises = [];

    for (let i = 0; i < this.workers.length; ++i) {
      const start = i * workerBatchSize;
      const end = Math.min((i + 1) * workerBatchSize, size);
      promises.push(new Promise((resolve, reject) => {
        try {
          this.workers[i].postMessage({
            organisms: organisms.slice(start, end),
          });
          this.workers[i].onmessage = (result) => {
            resolve(result.data);
          };
        } catch (error) {
          reject(error);
        }
      }));
    }

    const results = await Promise.all(promises);
    let orgs = [];
    for (let i = 0; i < results.length; ++i) {
      orgs = orgs.concat(results[i].updatedOrganisms);
    }
    if (orgs.length !== size) {
      throw new Error(`evaluateFitness returned incorrect number of organisms ${orgs.length}`);
    }
    return orgs;
  }

  serialize() {
    return this.population.serialize();
  }

  reset() {
    // Reset the static state of the Population
    Population.reset();
    this.population = null;
    // Terminate the webWorkers
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
  }

  getPopulation() {
    return this.population;
  }
}

const populationService = new PopulationService();

export const PopulationContext = createContext(populationService);

export default populationService;
