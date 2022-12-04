import { deviation } from 'd3-array';
import Organism from './organism';
import { SelectionType } from '../constants';
import { randomFloat, randomIndex } from '../globals/statsUtils';
import { fitnessBounds } from '../globals/treeUtils';
import { genRange } from '../globals/utils';

class Population {
  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor(size, genomeSize, target) {
    this.genId = Population.nextGenId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => new Organism({ genomeSize }));
    // Prep for the first call of runGeneration
    this.evaluateFitness();
  }

  runGeneration(selectionType, eliteCount, mutationNoise) {
    this.performSelection(selectionType, eliteCount, mutationNoise);
    this.evaluateFitness();
    return this.createGenNodes();
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns null
   */
  evaluateFitness() {
    // Have each Organism compute its fitness score
    this.organisms.forEach((org) => org.evaluateFitness(this.target));
  }

  performSelection(selectionType, eliteCount, mutationNoise) {
    const tournamentSize = 2;
    let nextGen;
    switch (selectionType) {
      case SelectionType.ROULETTE:
        nextGen = this.rouletteSelection(mutationNoise, eliteCount);
        break;
      case SelectionType.TOURNAMENT:
        nextGen = this.tournamentSelection(mutationNoise, tournamentSize, eliteCount);
        break;
      case SelectionType.SUS:
        nextGen = this.susSelection(mutationNoise, eliteCount);
        break;
      default:
        throw new Error(`[Population] Invalid SelectionType ${selectionType} provided`);
    }
    // Replace old population with new generation
    this.genId = Population.nextGenId;
    this.parents = this.organisms;
    this.organisms = nextGen;
  }

  // Parent Selection Algorithms
  // ------------------------------------------------------------
  rouletteSelection(mutationNoise, eliteCount) {
    const nextGen = this.getElites(eliteCount);
    const cdf = this.createFitnessCDF();
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.size) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }

    return nextGen;
  }

  tournamentSelection(mutationNoise, tournamentSize, eliteCount) {
    const nextGen = this.getElites(eliteCount);
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.size) {
      const p1 = this.tournamentSelectParent(tournamentSize);
      const p2 = this.tournamentSelectParent(tournamentSize);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }
    return nextGen;
  }

  susSelection(mutationNoise, eliteCount) {
    const nextGen = this.getElites(eliteCount);
    const cdf = this.createFitnessCDF();
    const step = cdf[cdf.length - 1] / this.size;
    let value = randomFloat(0, step);
    while (nextGen.length < this.size) {
      const p1 = this.susSelectParent(value);
      value += step;
      const p2 = this.susSelectParent(value);
      value += step;
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }
  }

  susSelectParent(cdf, value) {
    const index = cdf.findIndex((f) => value <= f);
    return this.organisms[index];
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

  static createGenNode(id, organisms) {
    const [min, mean, max] = fitnessBounds(organisms);
    let maxFitOrganism = null;
    const orgNodes = organisms.map((o) => {
      const node = o.createNode();
      if (o.fitness === max) maxFitOrganism = node;

      return node;
    });
    return {
      id,
      meanFitness: mean,
      maxFitness: max,
      minFitness: min,
      deviation: deviation(organisms, (o) => o.fitness),
      organisms: orgNodes,
      maxFitOrganism,
    };
  }

  createGenNodes() {
    const parents = Population.createGenNode(this.genId - 1, this.parents);
    const children = Population.createGenNode(this.genId, this.organisms);
    return [parents, children];
  }

  /**
   * The size of the population (number of organisms per generation)
   */
  get size() {
    return this.organisms.length;
  }
}

export default Population;
