import { deviation } from 'd3-array';
import Organism from './organism';
import { SelectionType } from '../constants';
import { randomFloat, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import createWorker from '../web-workers/phenotypeCreator';

const batchSize = 30;

class Population {
  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor({
    size,
    genomeSize,
    target,
    crossover,
    mutation,
    selection,
  }) {
    this.genId = Population.nextGenId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => Organism.create({ size: genomeSize }));
    this.crossover = crossover;
    this.selection = selection;
    this.mutation = mutation;
  }

  async initialize() {
    // Setup web workers for evaluateFitness work
    const numWorkers = Math.ceil(this.size / batchSize);
    this.workers = [...Array(numWorkers)].map(() => createWorker(this.target));
    // Prep for the first call of runGeneration
    this.organisms = await this.evaluateFitness();
  }

  async runGeneration() {
    // Select all the parents for reproduction
    const parents = this.performSelection(this.selection);
    // Replace old population with new generation
    this.organisms = this.reproduce(parents, this.selection, this.crossover, this.mutation);
    this.genId = Population.nextGenId;
    this.organisms = await this.evaluateFitness();

    return this.createStats();
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns null
   */
  async evaluateFitness() {
    const promises = [];

    for (let i = 0; i < this.workers.length; ++i) {
      const start = i * batchSize;
      const end = Math.min((i + 1) * batchSize, this.size);
      promises.push(new Promise((resolve, reject) => {
        try {
          this.workers[i].postMessage({
            organisms: this.organisms.slice(start, end),
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
    if (orgs.length !== this.size) {
      throw new Error(`evaluateFitness returned incorrect number of organisms ${orgs.length}`);
    }
    return orgs;
  }

  performSelection({ type, tournamentSize, eliteCount }) {
    const count = (this.size - eliteCount) / 2;
    switch (type) {
      case SelectionType.ROULETTE:
        return this.rouletteSelection(count);
      case SelectionType.TOURNAMENT:
        return this.tournamentSelection(count, tournamentSize);
      case SelectionType.SUS:
        return this.susSelection(count);
      default:
        throw new Error(`Invalid SelectionType ${type} provided`);
    }
  }

  reproduce(parents, selection, crossover, mutation) {
    const { eliteCount } = selection;
    // Generate (N - eliteCount) offspring for the next generation
    const nextGen = this.getElites(eliteCount);
    parents.forEach(([p1, p2]) => {
      const offspring = Organism.reproduce(p1, p2, crossover, mutation);
      nextGen.push(...offspring);
    });
    return nextGen;
  }

  // Parent Selection Algorithms
  // ------------------------------------------------------------
  rouletteSelection(count) {
    const parents = [];
    const cdf = this.createFitnessCDF();
    while (parents.length < count) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      parents.push([p1, p2]);
    }
    return parents;
  }

  tournamentSelection(count, tournamentSize) {
    const parents = [];
    while (parents.length < count) {
      const p1 = this.tournamentSelectParent(tournamentSize);
      const p2 = this.tournamentSelectParent(tournamentSize);
      parents.push([p1, p2]);
    }
    return parents;
  }

  susSelection(count) {
    const parents = [];
    const cdf = this.createFitnessCDF();
    const step = cdf[cdf.length - 1] / this.size;
    let value = randomFloat(0, step);
    while (parents.length < count) {
      const p1 = this.susSelectParent(value);
      value += step;
      const p2 = this.susSelectParent(value);
      value += step;
      parents.push([p1, p2]);
    }
    return parents;
  }

  // Parent Selection Algorithm Helpers
  // ------------------------------------------------------------
  rouletteSelectParent(cdf) {
    const total = cdf[cdf.length - 1];
    const n = randomFloat(0, total);
    const index = cdf.findIndex((f) => n <= f);
    return this.organisms[index];
  }

  tournamentSelectParent(size) {
    let best = this.randomOrganism();
    genRange(size).forEach(() => {
      const next = this.randomOrganism();
      if (next.fitness > best.fitness) {
        best = next;
      }
    });

    return best;
  }

  susSelectParent(cdf, value) {
    const index = cdf.findIndex((f) => value <= f);
    return this.organisms[index];
  }

  createFitnessCDF() {
    const cdf = [];
    let fitnessSum = 0;
    this.organisms.forEach((org) => {
      fitnessSum += org.fitness;
      cdf.push(fitnessSum);
    });
    return cdf;
  }

  getElites(count) {
    if (count === 0) return [];

    const organisms = this.organismsByFitness();
    return organisms.slice(0, count).map((org) => Organism.clone(org));
  }

  randomOrganism() {
    const index = randomIndex(this.size);
    return this.organisms[index];
  }

  maxFitOrganism() {
    return this.organismsByFitness()[0];
  }

  // Helper Methods
  // ------------------------------------------------------------
  /**
   * Sorts a copy of the list of organisms by fitness in descending order.
   * @returns the array of sorted organisms
   */
  organismsByFitness() {
    return [...this.organisms].sort((a, b) => b.fitness - a.fitness);
  }

  createStats() {
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let total = 0;
    let maxFitOrganism = null;
    for (let i = 0; i < this.size; ++i) {
      const { fitness } = this.organisms[i];
      if (fitness < min) min = fitness;
      if (fitness > max) {
        max = fitness;
        maxFitOrganism = this.organisms[i];
      }
      total += fitness;
    }
    const mean = total / this.size;

    return {
      id: this.genId,
      meanFitness: mean,
      maxFitness: max,
      minFitness: min,
      deviation: deviation(this.organisms, (o) => o.fitness),
      maxFitOrganism,
    };
  }

  /**
   * The size of the population (number of organisms per generation)
   */
  get size() {
    return this.organisms.length;
  }
}

export default Population;
