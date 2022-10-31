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
    const child = new Organism({
      genomeSize: parentA.genome.length,
      parentA: parentA.id,
      parentB: parentB.id,
    });
    child.genome = newGenome;
    // Update the parent's offspring counts
    parentA.addOffspring(1);
    parentB.addOffspring(1);

    return child;
  }

  static deserialize(data) {
    const genome = data.genome.split('');
    const id = Number.parseInt(data.id, 10);
    const organism = new Organism({
      id,
      genomeSize: genome.length,
      parentA: data.parentA,
      parentB: data.parentB,
    });
    organism.genome = genome;

    return organism;
  }

  constructor({
    id,
    genomeSize,
    parentA = null,
    parentB = null,
  }) {
    this.id = id ?? Organism.nextId;
    this.genome = createRandomGenome(genomeSize);
    this.parentA = parentA;
    this.parentB = parentB;
    this.fitness = 0;
    this.offspringCount = 0;
  }

  evaluateFitness(target) {
    this.fitness = target.split('').filter((l, i) => this.genome[i] === l).length;
    return this.fitness;
  }

  subsequence(start, end) {
    return this.genome.slice(start, end);
  }

  addOffspring(count) {
    this.offspringCount += count;
  }

  createNode() {
    return {
      id: this.id,
      parentA: this.parentA,
      parentB: this.parentB,
      genome: this.toString(),
      fitness: this.fitness,
      offspring: this.offspringCount,
    };
  }

  toString() {
    return this.genome.join('');
  }
}

export default Organism;
