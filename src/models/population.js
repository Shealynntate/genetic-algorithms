import { deviation } from 'd3-array';
import Organism from './organism';
import { SelectionType } from '../constants';
import { randomFloat, randomIndex } from '../globals/statsUtils';
import WorkerBuilder from '../web-workers/workerBuilder';
import evaluateFitnessWorker from '../web-workers/evaluateFitnessWorker';
import { genRange } from '../globals/utils';

class Population {
  static worker = new WorkerBuilder(evaluateFitnessWorker);

  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor(size, genomeSize, target) {
    this.genId = Population.nextGenId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => Organism.create({ size: genomeSize }));
    // Prep for the first call of runGeneration
    this.evaluateFitness();
  }

  runGeneration(selectionType, eliteCount, crossoverProb, mutationNoise) {
    // console.time('Run Selection');
    this.performSelection(selectionType, eliteCount, crossoverProb, mutationNoise);
    // console.timeEnd('Run Selection');
    // console.time('Run Evaluate Fitness');
    this.evaluateFitness();
    // const { results } = await this.evaluateFitness();
    // for (let i = 0; i < results.length; ++i) {
    //   this.organisms[i].fitness = results[i];
    // }
    // console.timeEnd('Run Evaluate Fitness');
    // console.time('Create Node');
    return this.createStats();
    // console.timeEnd('Create Node');
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns null
   */
  evaluateFitness() {
    // Have each Organism compute its fitness score
    this.organisms.forEach((org) => Organism.evaluateFitness(org, this.target));
    // return new Promise((resolve, reject) => {
    //   try {
    //     Population.worker.postMessage({
    //       phenotypes: this.organisms.map((org) => org.genome.phenotype),
    //       target: this.target,
    //     });
    //     Population.worker.onmessage = (result) => {
    //       resolve(result.data);
    //       // Population.worker.terminate();
    //     };
    //   } catch (error) {
    //     reject(error);
    //   }
    // });
  }

  performSelection(selectionType, eliteCount, crossoverProb, mutationNoise) {
    const tournamentSize = 2;
    let nextGen;
    switch (selectionType) {
      case SelectionType.ROULETTE:
        nextGen = this.rouletteSelection(mutationNoise, eliteCount, crossoverProb);
        break;
      case SelectionType.TOURNAMENT:
        nextGen = this.tournamentSelection(
          mutationNoise,
          tournamentSize,
          eliteCount,
          crossoverProb,
        );
        break;
      case SelectionType.SUS:
        nextGen = this.susSelection(mutationNoise, eliteCount, crossoverProb);
        break;
      default:
        throw new Error(`[Population] Invalid SelectionType ${selectionType} provided`);
    }
    // Replace old population with new generation
    this.genId = Population.nextGenId;
    this.organisms = nextGen;
  }

  // Parent Selection Algorithms
  // ------------------------------------------------------------
  rouletteSelection(mutationNoise, eliteCount, crossoverProb) {
    const nextGen = this.getElites(eliteCount);
    const cdf = this.createFitnessCDF();
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.size) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      const offspring = Organism.reproduce(p1, p2, crossoverProb, mutationNoise);
      nextGen.push(...offspring);
    }

    return nextGen;
  }

  tournamentSelection(mutationNoise, tournamentSize, eliteCount, crossoverProb) {
    const nextGen = this.getElites(eliteCount);
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.size) {
      const p1 = this.tournamentSelectParent(tournamentSize);
      const p2 = this.tournamentSelectParent(tournamentSize);
      const offspring = Organism.reproduce(p1, p2, crossoverProb, mutationNoise);
      nextGen.push(...offspring);
    }
    return nextGen;
  }

  susSelection(mutationNoise, eliteCount, crossoverProb) {
    const nextGen = this.getElites(eliteCount);
    const cdf = this.createFitnessCDF();
    const step = cdf[cdf.length - 1] / this.size;
    let value = randomFloat(0, step);
    while (nextGen.length < this.size) {
      const p1 = this.susSelectParent(value);
      value += step;
      const p2 = this.susSelectParent(value);
      value += step;
      const offspring = Organism.reproduce(p1, p2, crossoverProb, mutationNoise);
      nextGen.push(...offspring);
    }
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
    return organisms.slice(0, count).map((org) => org.clone());
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
