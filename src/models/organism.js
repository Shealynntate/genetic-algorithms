import DNA from './dna';
import Genome from './genome';
import { flipCoin } from './utils';

class Organism {
  static get nextId() {
    Organism.count = Organism.count == null ? 0 : Organism.count + 1;
    return Organism.count;
  }

  // TODO: Fix this
  static reproduce(parentA, parentB, mutation) {
    // Crossover event
    const midPoint = Math.trunc(parentA.genome.size / 2);
    let newDNA = [...parentA.subsequence(0, midPoint), ...parentB.subsequence(midPoint)];
    // Mutation event
    newDNA = newDNA.map((dna) => (flipCoin(mutation) ? new DNA() : dna));
    // Create the child Organism
    const child = new Organism({
      genomeSize: parentA.genome.length,
      genome: new Genome({ size: parentA.genome.size, dna: newDNA }),
      parentA: parentA.id,
      parentB: parentB.id,
    });
    // Update the parent's offspring counts
    parentA.addChild(child.id);
    parentB.addChild(child.id);

    return child;
  }

  static deserialize(data) {
    const genome = Genome.deserialize(data.genome);
    const id = Number.parseInt(data.id, 10);
    const organism = new Organism({
      id,
      genomeSize: genome.size,
      parentA: data.parentA,
      parentB: data.parentB,
    });
    organism.genome = genome;

    return organism;
  }

  constructor({
    id,
    genomeSize,
    genome = null,
    parentA = null,
    parentB = null,
  }) {
    this.id = id ?? Organism.nextId;
    this.genome = genome ?? new Genome({ size: genomeSize });
    this.parentA = parentA;
    this.parentB = parentB;
    this.fitness = 0;
    this.children = [];
  }

  get childrenCount() {
    return new Set(this.children).size;
  }

  evaluateFitness(target) {
    this.fitness = this.genome.evaluateFitness(target);
    return this.fitness;
  }

  subsequence(start, end) {
    return this.genome.subsequence(start, end);
  }

  addChild(child) {
    this.children.push(child);
  }

  getPhenotype() {
    return this.genome.getPhenotype();
  }

  createNode() {
    return {
      id: this.id,
      parentA: this.parentA,
      parentB: this.parentB,
      genome: this.genome.createNode(),
      fitness: this.fitness,
      children: this.children,
    };
  }

  toString() {
    return this.genome.join('');
  }
}

export default Organism;
