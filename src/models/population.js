/* eslint-disable class-methods-use-this */
import { deviation } from 'd3-array';
import { omit } from 'lodash';
import Organism from './organism';
import { SelectionType, statsSigFigs, workerBatchSize } from '../constants';
import { randomFloat, randomIndex, setSigFigs } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import createWorker from '../web-workers/phenotypeCreator';
import Mutation from './mutation';
import Selection from './selection';
import Crossover from './crossover';

class Population {
  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  static restorePopulation(data) {
    Population.count = data.genId;
    Organism.restoreId(data.organismId);

    return new Population(data);
  }

  static reset() {
    Population.count = null;
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor({
    genId = Population.nextGenId,
    size,
    minGenomeSize,
    maxGenomeSize,
    minPoints,
    maxPoints,
    target,
    crossover,
    mutation,
    selection,
    organisms = null,
    best = null,
  }) {
    this.genId = genId;
    this.target = target;
    this.organisms = organisms ?? [...Array(size)].map(
      () => Organism.create({ size: minGenomeSize, numSides: minPoints }),
    );
    this.crossover = new Crossover(crossover);
    this.selection = new Selection(selection);
    this.mutation = new Mutation(mutation);
    this.maxGenomeSize = maxGenomeSize;
    this.minPoints = minPoints;
    this.maxPoints = maxPoints;
    this.best = best;
    // If population is shrinking, keep the first <size> organisms
    // If fitness has been evaluated, then they're the most fit, otherwise it's a random selection
    if (this.organisms.length > size) {
      this.organisms = this.organisms.slice(0, size);
    }
    // If the population is expanding, duplicate the first organism until we reach <size>
    // It's either the most fit organism or a random selection
    while (this.organisms.length < size) {
      // Clone and mutate first organism
      this.organisms.push(Organism.cloneAndMutate(this.organisms[0], this.mutation));
    }
  }

  serialize() {
    const { best } = this;
    if (best) {
      best.organism = omit(best.organism, ['phenotype']);
    }
    return {
      genId: this.genId,
      organisms: this.organisms.map((o) => omit(o, ['phenotype'])),
      mutation: this.mutation.serialize(),
      crossover: this.crossover.serialize(),
      selection: this.selection.serialize(),
      best,
      organismId: Organism.getLatestId(),
    };
  }

  async initialize() {
    // Setup web workers for evaluateFitness work
    const numWorkers = Math.ceil(this.size / workerBatchSize);
    this.workers = [...Array(numWorkers)].map(() => createWorker(this.target));
    // Prep for the first call of runGeneration
    this.organisms = await this.evaluateFitness();
  }

  async runGeneration(isMerge) {
    if (isMerge) {
      // this.mutation.markDisruptionGen();
      const best = this.maxFitOrganism();
      const bounds = {
        maxGenomeSize: this.maxGenomeSize,
        minPoints: this.minPoints,
        maxPoints: this.maxPoints,
      };
      const children = [];
      while (children.length < this.size) {
        children.push(Organism.cloneAndMutate(best, this.mutation, bounds));
      }
      this.organisms = children;
    } else {
      const parents = this.performSelection(this.selection);
      this.organisms = this.reproduce(parents, this.selection, this.crossover, this.mutation);
      this.organisms = await this.evaluateFitness();
    }

    this.genId = Population.nextGenId;
    const stats = this.createStats();
    // Let Mutation and Crossover strategies update if needed
    this.mutation.markNextGen(stats);
    this.crossover.markNextGen(stats);

    return stats;
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns null
   */
  async evaluateFitness() {
    const promises = [];

    for (let i = 0; i < this.workers.length; ++i) {
      const start = i * workerBatchSize;
      const end = Math.min((i + 1) * workerBatchSize, this.size);
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
    const bounds = {
      maxGenomeSize: this.maxGenomeSize,
      minPoints: this.minPoints,
      maxPoints: this.maxPoints,
    };
    parents.forEach(([p1, p2]) => {
      const offspring = Organism.reproduce(p1, p2, crossover, mutation, bounds);
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
      const p1 = this.susSelectParent(cdf, value);
      value += step;
      const p2 = this.susSelectParent(cdf, value);
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
    const chromosomePenalty = 0; // 0.0001;
    let best = this.randomOrganism();
    // TODO: Temp test length penalty on chromosomes
    let fitA = best.fitness - (chromosomePenalty * best.genome.chromosomes.length);
    genRange(size).forEach(() => {
      const next = this.randomOrganism();
      const fitB = next.fitness - (chromosomePenalty * next.genome.chromosomes.length);
      if (fitB > fitA) {
        best = next;
        fitA = fitB;
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
    // Update the overall best organism
    let isGlobalBest = false;
    if (!this.best || max > this.best.organism.fitness) {
      this.best = { genId: this.genId, organism: maxFitOrganism };
      isGlobalBest = true;
    }
    return {
      genId: this.genId,
      meanFitness: setSigFigs(mean, statsSigFigs),
      maxFitness: setSigFigs(max, statsSigFigs),
      minFitness: setSigFigs(min, statsSigFigs),
      deviation: setSigFigs(deviation(this.organisms, (o) => o.fitness), statsSigFigs),
      maxFitOrganism,
      isGlobalBest,
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
