import _ from 'lodash';
import Organism from './organism';
import { LoadedDie, meanFitness } from './utils';

//
class Population {
  static get nextId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  constructor(size, target) {
    this.id = Population.nextId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => new Organism({ genomeSize: target.length }));
    this.loadedDie = new LoadedDie(size);
  }

  get maxFitness() {
    return this.target?.length || 0;
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
    this.organismsByFitness();
    return this.organisms[0].fitness >= this.maxFitness;
  }

  evaluateFitness() {
    // Have each Organism compute its fitness score
    this.organisms.forEach((org) => org.evaluateFitness(this.target));
  }

  createProbabilityDistribution() {
    // Normalize the score to form a probability distribution
    const totalFitness = _.sumBy(this.organisms, (org) => org.fitness);
    const probabilities = this.organisms.map((org) => org.fitness / totalFitness);
    // Prepare the loaded die for selection process
    this.loadedDie.load(probabilities);
  }

  rollParent() {
    return this.organisms[this.loadedDie.roll()];
  }

  performSelection(mutationRate) {
    const nextGen = [];
    // Generate N offspring for the next generation
    while (nextGen.length < this.organisms.length) {
      // Roll loaded die to select the two parents to mate
      const p1 = this.rollParent();
      const p2 = this.rollParent();
      const offspring = Organism.reproduce(p1, p2, mutationRate);
      nextGen.push(offspring);
    }
    // Replace old population with new generation
    this.organisms = nextGen;
  }

  runGeneration(mutationRate) {
    this.createProbabilityDistribution();
    this.performSelection(mutationRate);
    this.evaluateFitness();

    return this.createGenNode();
  }

  createGenNode() {
    return {
      id: this.id,
      meanFitness: meanFitness(this.organisms),
      variance: 1,
      organisms: this.organisms.map((o) => o.createNode()),
    };
  }
}

export default Population;
