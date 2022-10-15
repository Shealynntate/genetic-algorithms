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

  static deserialize(data) {
    const genome = data.genome.split('');
    const id = Number.parseInt(data.id, 10);
    const organism = new Organism(genome.length, id);
    organism.genome = genome;

    return organism;
  }

  constructor(genomeSize, id) {
    this.id = id ?? Organism.nextId;
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

  toJSON() {
    return {
      id: this.id,
      fitness: this.fitness,
      genome: this.genome.join(''),
    };
  }

  ToString() {
    return this.genome.join('');
  }
}

export default Organism;
