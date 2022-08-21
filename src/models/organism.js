import { createRandomGenome } from './utils';

class Organism {
  constructor(genomeSize) {
    this.genome = createRandomGenome(genomeSize);
    this.fitness = 0;
  }

  evaluateFitness(target) {
    this.fitness = target.filter((l, i) => this.genome[i] === l).length;
    return this.fitness;
  }

  ToString() {
    return `[${this.genome}]`;
  }
}

export default Organism;
