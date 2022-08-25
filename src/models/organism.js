import {
  createRandomGenome,
  flipCoin,
  randomDNA,
} from './utils';

class Organism {
  static get nextId() {
    Organism.count = Organism.count == null ? 0 : Organism.count + 1;
    return Organism.count;
  }

  static reproduce(parentA, parentB, mutation) {
    // Crossover event
    const midPoint = Math.trunc(parentA.genome.length / 2);
    let newGenome = [...parentA.subsequence(0, midPoint), ...parentB.subsequence(midPoint)];
    // Mutation event
    newGenome = newGenome.map((gene) => (flipCoin(mutation) ? randomDNA() : gene));
    // Create the child Organism
    const child = new Organism(parentA.genome.length);
    child.genome = newGenome;

    return child;
  }

  constructor(genomeSize) {
    this.id = Organism.nextId;
    this.genome = createRandomGenome(genomeSize);
    this.fitness = 0;
  }

  evaluateFitness(target) {
    this.fitness = target.split('').filter((l, i) => this.genome[i] === l).length;
    return this.fitness;
  }

  subsequence(start, end) {
    return this.genome.slice(start, end);
  }

  ToString() {
    return `[${this.genome.join('')}]`;
  }
}

export default Organism;
