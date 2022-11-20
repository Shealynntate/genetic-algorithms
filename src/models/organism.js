import DNA from './dna';
import Genome from './genome';

const largeMutation = 0; // 0.005;
const crossoverProb = 0.05;

class Organism {
  static get nextId() {
    Organism.count = Organism.count == null ? 0 : Organism.count + 1;
    return Organism.count;
  }

  static createChild(parentA, parentB, newDNA) {
    const child = new Organism({
      genomeSize: parentA.genome.length,
      genome: new Genome({ size: parentA.genome.size, dna: newDNA }),
      parentA: parentA.id,
      parentB: parentB.id,
    });
    // Update the parent's offspring counts
    parentA.addChild(child);
    parentB.addChild(child);

    return child;
  }

  static reproduce(parentA, parentB, mutation) {
    // Crossover event
    let [newDNA1, newDNA2] = Genome.uniformCrossover2(
      parentA.genome,
      parentB.genome,
      crossoverProb,
    );
    // Mutation event
    newDNA1 = newDNA1.map((dna) => (DNA.mutate(dna, mutation, largeMutation)));
    newDNA2 = newDNA2.map((dna) => (DNA.mutate(dna, mutation, largeMutation)));
    // Create the child Organisms
    const childA = Organism.createChild(parentA, parentB, newDNA1);
    const childB = Organism.createChild(parentA, parentB, newDNA2);

    return [childA, childB];
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
