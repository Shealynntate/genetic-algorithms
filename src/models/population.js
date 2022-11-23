import _ from 'lodash';
import { deviation } from 'd3-array';
import Organism from './organism';
import { fitnessBounds } from '../globals/utils';
import LoadedDie from '../globals/loadedDie';

//
class Population {
  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  constructor(size, genomeSize, target) {
    this.genId = Population.nextGenId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => new Organism({ genomeSize }));
    this.loadedDie = new LoadedDie(size);
  }

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

  isTargetReached() {
    return this.organisms[0].fitness >= 1;
  }

  evaluateFitness() {
    // Have each Organism compute its fitness score
    this.organisms.forEach((org) => org.evaluateFitness(this.target));
  }

  createProbabilityDistribution() {
    // Normalize the score to form a probability distribution
    const totalFitness = _.sumBy(this.organisms, (org) => org.fitness) || 1;
    const probabilities = this.organisms.map((org) => org.fitness / totalFitness);
    // Prepare the loaded die for selection process
    this.loadedDie.load(probabilities);
  }

  rollParent() {
    return this.organisms[this.loadedDie.roll()];
  }

  performSelection(mutationNoise) {
    const nextGen = [];
    // Generate N offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      // Roll loaded die to select the two parents to mate
      const p1 = this.rollParent();
      const p2 = this.rollParent();
      const offspring = Organism.reproduce(p1, p2, mutationNoise);
      nextGen.push(...offspring);
    }
    // Replace old population with new generation
    this.genId = Population.nextGenId;
    this.organisms = nextGen;
  }

  runGeneration(mutationNoise) {
    this.createProbabilityDistribution();
    this.performSelection(mutationNoise);
    this.evaluateFitness();

    return this.createGenNode();
  }

  createGenNode() {
    const [min, mean, max] = fitnessBounds(this.organisms);
    let maxFitOrganism = null;
    const orgNodes = this.organisms.map((o) => {
      const node = o.createNode();
      if (o.fitness === max) maxFitOrganism = node;

      return node;
    });
    return {
      id: this.genId,
      meanFitness: mean,
      maxFitness: max,
      minFitness: min,
      deviation: deviation(this.organisms, (o) => o.fitness),
      organisms: orgNodes,
      maxFitOrganism,
    };
  }
}

export default Population;
