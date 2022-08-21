import { createRandomGenome } from './utils';

class Organism {
  constructor(genomeSize) {
    this.genome = createRandomGenome(genomeSize);
  }

  ToString() {
    return `[${this.genome}]`;
  }
}

export default Organism;
