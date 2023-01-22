/* eslint-disable class-methods-use-this */
import { deviation } from 'd3-array';
import _, { omit } from 'lodash';
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
    // eslint-disable-next-line no-unused-vars
    organisms = null,
    best = null,
  }) {
    this.genId = genId;
    this.target = target;
    // this.species = [1, 2].map(() => (
    this.species = [1].map(() => (
      [...Array(size)].map(
        () => Organism.create({ size: minGenomeSize, numSides: minPoints }),
      )
    ));
    // this.organisms = organisms ?? [...Array(size)].map(
    //   () => Organism.create({ size: minGenomeSize }),
    // );
    this.crossover = new Crossover(crossover);
    this.selection = new Selection(selection);
    this.mutation = new Mutation(mutation);
    this.maxGenomeSize = maxGenomeSize;
    this.minPoints = minPoints;
    this.maxPoints = maxPoints;
    this.best = best;
    // If population is shrinking, keep the first <size> organisms
    // If fitness has been evaluated, then they're the most fit, otherwise it's a random selection
    // if (this.organisms.length > size) {
    //   this.organisms = this.organisms.slice(0, size);
    // }
    // If the population is expanding, duplicate the first organism until we reach <size>
    // It's either the most fit organism or a random selection
    // while (this.organisms.length < size) {
    //   // Clone and mutate first organism
    //   this.organisms.push(Organism.cloneAndMutate(this.organisms[0], this.mutation));
    // }
  }

  serialize() {
    const { best } = this;
    if (best) {
      best.organism = omit(best.organism, ['phenotype']);
    }
    return {
      genId: this.genId,
      species: this.species.map((organisms) => organisms.map((o) => omit(o, ['phenotype']))),
      mutation: this.mutation.serialize(),
      crossover: this.crossover.serialize(),
      selection: this.selection.serialize(),
      best,
      organismId: Organism.getLatestId(),
    };
  }

  async initialize() {
    // Setup web workers for evaluateFitness work
    const numWorkers = Math.ceil(this.totalSize / workerBatchSize);
    this.workers = [...Array(numWorkers)].map(() => createWorker(this.target));
    // Prep for the first call of runGeneration
    for (let i = 0; i < this.species.length; ++i) {
      // eslint-disable-next-line no-await-in-loop
      this.species[i] = await this.evaluateFitness(this.species[i]);
    }
  }

  async runGeneration(isMerge) {
    if (isMerge) {
      // return this.runMergeGeneration();
      this.mutation.markDisruptionGen();
    }

    for (let i = 0; i < this.species.length; ++i) {
      const organisms = this.species[i];
      // Select all the parents for reproduction
      const parents = this.performSelection(organisms, organisms, this.size, this.selection);
      // Replace old population with new generation
      this.species[i] = this.reproduce(parents, this.selection, this.crossover, this.mutation);
      // eslint-disable-next-line no-await-in-loop
      this.species[i] = await this.evaluateFitness(this.species[i]);
    }

    this.genId = Population.nextGenId;
    const stats = this.createStats();
    // Let Mutation and Crossover strategies update if needed
    this.mutation.markNextGen(stats);
    this.crossover.markNextGen(stats);

    return stats;
  }

  async runMergeGeneration() {
    // const allOrganisms = _.concat(...this.species);
    // Select all the parents for reproduction
    const len = this.species[0].length;
    const parents = this.performSelection(
      this.species[0],
      this.species[1],
      this.totalSize,
      this.selection,
    );
    // Replace old population with new generation
    const children = this.reproduce(parents, this.selection, this.crossover, this.mutation);
    for (let i = 0; i < this.species.length; ++i) {
      this.species[i] = children.slice(i, i + len);
      // Temp code!!
      if (i === this.species.length - 1) {
        this.species[i] = [...Array(this.size)].map(
          () => Organism.create({ size: 1, numSides: this.minPoints }),
        );
      }
      // eslint-disable-next-line no-await-in-loop
      this.species[i] = await this.evaluateFitness(this.species[i]);
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
  async evaluateFitness(organisms) {
    const promises = [];

    for (let i = 0; i < this.workers.length; ++i) {
      const start = i * workerBatchSize;
      const end = Math.min((i + 1) * workerBatchSize, this.size);
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
    if (orgs.length !== this.size) {
      throw new Error(`evaluateFitness returned incorrect number of organisms ${orgs.length}`);
    }
    return orgs;
  }

  performSelection(speciesA, speciesB, size, { type, tournamentSize, eliteCount }) {
    const count = (size - eliteCount) / 2;
    switch (type) {
      case SelectionType.ROULETTE:
        return this.rouletteSelection(speciesA, speciesB, count);
      case SelectionType.TOURNAMENT:
        return this.tournamentSelection(speciesA, speciesB, count, tournamentSize);
      case SelectionType.SUS:
        return this.susSelection(speciesA, speciesB, count);
      default:
        throw new Error(`Invalid SelectionType ${type} provided`);
    }
  }

  reproduce(parents, selection, crossover, mutation) {
    const { eliteCount } = selection;
    // Generate (N - eliteCount) offspring for the next generation
    const nextGen = this.getElites(parents, eliteCount);
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
  rouletteSelection(speciesA, speciesB, count) {
    const parents = [];
    const cdfA = this.createFitnessCDF(speciesA);
    const cdfB = this.createFitnessCDF(speciesB);
    while (parents.length < count) {
      const p1 = this.rouletteSelectParent(speciesA, cdfA);
      const p2 = this.rouletteSelectParent(speciesB, cdfB);
      parents.push([p1, p2]);
    }
    return parents;
  }

  tournamentSelection(speciesA, speciesB, count, tournamentSize) {
    const parents = [];
    while (parents.length < count) {
      const p1 = this.tournamentSelectParent(speciesA, tournamentSize);
      const p2 = this.tournamentSelectParent(speciesB, tournamentSize);
      parents.push([p1, p2]);
    }
    return parents;
  }

  susSelection(speciesA, speciesB, count) {
    const parents = [];
    const cdfA = this.createFitnessCDF(speciesA);
    const cdfB = this.createFitnessCDF(speciesB);
    const stepA = cdfA[cdfA.length - 1] / this.size;
    const stepB = cdfB[cdfB.length - 1] / this.size;
    let valueA = randomFloat(0, stepA);
    let valueB = randomFloat(0, stepA);
    while (parents.length < count) {
      const p1 = this.susSelectParent(speciesA, valueA);
      valueA += stepA;
      const p2 = this.susSelectParent(speciesB, valueB);
      valueB += stepB;
      parents.push([p1, p2]);
    }
    return parents;
  }

  // Parent Selection Algorithm Helpers
  // ------------------------------------------------------------
  rouletteSelectParent(organisms, cdf) {
    const total = cdf[cdf.length - 1];
    const n = randomFloat(0, total);
    const index = cdf.findIndex((f) => n <= f);
    return organisms[index];
  }

  tournamentSelectParent(organisms, size) {
    const chromosomePenalty = 0; // 0.0001;
    let best = this.randomOrganism(organisms);
    // TODO: Temp test length penalty on chromosomes
    let fitA = best.fitness - (chromosomePenalty * best.genome.chromosomes.length);
    genRange(size).forEach(() => {
      const next = this.randomOrganism(organisms);
      const fitB = next.fitness - (chromosomePenalty * next.genome.chromosomes.length);
      if (fitB > fitA) {
        best = next;
        fitA = fitB;
      }
    });

    return best;
  }

  susSelectParent(organisms, cdf, value) {
    const index = cdf.findIndex((f) => value <= f);
    return organisms[index];
  }

  createFitnessCDF(organisms) {
    const cdf = [];
    let fitnessSum = 0;
    organisms.forEach((org) => {
      fitnessSum += org.fitness;
      cdf.push(fitnessSum);
    });
    return cdf;
  }

  getElites(organisms, count) {
    if (count === 0) return [];

    const orgs = this.organismsByFitness(organisms);
    return orgs.slice(0, count).map((org) => Organism.clone(org));
  }

  randomOrganism(organisms) {
    const index = randomIndex(this.size);
    return organisms[index];
  }

  maxFitOrganism() {
    const sorted = this.species.map((organisms) => this.organismsByFitness(organisms));
    const top = sorted.map((s) => s[0]);
    return this.organismsByFitness(top)[0];
  }

  // Helper Methods
  // ------------------------------------------------------------
  /**
   * Sorts a copy of the list of organisms by fitness in descending order.
   * @returns the array of sorted organisms
   */
  organismsByFitness(organisms) {
    return [...organisms].sort((a, b) => b.fitness - a.fitness);
  }

  createStats() {
    const allOrgs = _.concat(...this.species);
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let total = 0;
    let maxFitOrganism = null;
    for (let i = 0; i < allOrgs.length; ++i) {
      const { fitness } = allOrgs[i];
      if (fitness < min) min = fitness;
      if (fitness > max) {
        max = fitness;
        maxFitOrganism = allOrgs[i];
      }
      total += fitness;
    }
    const mean = total / allOrgs.length;
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
      deviation: setSigFigs(deviation(allOrgs, (o) => o.fitness), statsSigFigs),
      maxFitOrganism,
      isGlobalBest,
    };
  }

  /**
   * The size of the population (number of organisms per generation)
   */
  get size() {
    return this.species[0].length;
  }

  get totalSize() {
    return _.concat(...this.species).length;
  }
}

export default Population;
