import { deviation } from 'd3-array';
import Organism from './organism';
import { SelectionType } from '../constants';
import {
  fitnessBounds,
  genRange,
  randomFloat,
  randomIndex,
} from '../globals/utils';

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

  runGeneration(selectionType, mutationNoise) {
    this.performSelection(selectionType, mutationNoise);
    this.evaluateFitness();

    return this.createGenNodes();
  }

  evaluateFitness() {
    // Have each Organism compute its fitness score
    this.organisms.forEach((org) => org.evaluateFitness(this.target));
  }

  performSelection(selectionType, mutationNoise) {
    const tournamentSize = 2;
    const eliteCount = 2;
    let nextGen;
    switch (selectionType) {
      case SelectionType.ROULETTE:
        nextGen = this.rouletteSelection(mutationNoise);
        break;
      case SelectionType.ROULETTE_ELITE:
        nextGen = this.rouletteSelectionElite(mutationNoise, eliteCount);
        break;
      case SelectionType.TOURNAMENT:
        nextGen = this.tournamentSelection(mutationNoise, tournamentSize);
        break;
      case SelectionType.TOURNAMENT_ELITE:
        nextGen = this.tournamentSelectionElite(mutationNoise, tournamentSize, eliteCount);
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
  rouletteSelection(mutationNoise) {
    const cdf = this.createFitnessCDF();
    const nextGen = [];
    // Generate N offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }

    return nextGen;
  }

  rouletteSelectionElite(mutationNoise, eliteCount) {
    const organisms = this.organismsByFitness();
    const nextGen = organisms.slice(0, eliteCount);
    const cdf = this.createFitnessCDF();
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }

    return nextGen;
  }

  tournamentSelection(mutationNoise, tournamentSize) {
    const nextGen = [];
    // Generate N offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      const p1 = this.tournamentParentSelect(tournamentSize);
      const p2 = this.tournamentParentSelect(tournamentSize);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }
    return nextGen;
  }

  // TODO: CLONE THE PARENTS PASSED INTO NEXT GEN!!
  tournamentSelectionElite(mutationNoise, tournamentSize, eliteCount) {
    const organisms = this.organismsByFitness();
    const nextGen = organisms.slice(0, eliteCount);
    // Generate (N - eliteCount) offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      const p1 = this.tournamentParentSelect(tournamentSize);
      const p2 = this.tournamentParentSelect(tournamentSize);
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }
    return nextGen;
  }

  // Parent Selection Algorithm Helpers
  // ------------------------------------------------------------
  rouletteSelectParent(cdf) {
    const total = cdf[cdf.length - 1];
    const n = randomFloat(0, total);
    const index = cdf.findIndex((f) => n <= f);
    return this.organisms[index];
  }

  tournamentParentSelect(size) {
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

  randomOrganism() {
    const index = randomIndex(this.organisms.length);
    return this.organisms[index];
  }

  maxFitOrganism() {
    this.organismsByFitness();
    return this.organisms[0];
  }

  // Helper Methods
  // ------------------------------------------------------------
  /**
   * Sorts the list of organisms by fitness in descending order. This also mutates the list
   * of Organisms held by the population.
   * @returns the array of organisms
   */
  organismsByFitness() {
    this.evaluateFitness();
    this.organisms.sort((a, b) => b.fitness - a.fitness);
    return this.organisms;
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
}

export default Population;
