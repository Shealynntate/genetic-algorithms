import { flipCoin } from '../globals/statsUtils';
import Genome from './genome';

const crossoverProb = 0.1;

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
    parentA.addChild(child.id);
    parentB.addChild(child.id);

    return child;
  }

  static reproduce(parentA, parentB, noise) {
    // Crossover event
    const [newDNA1, newDNA2] = Genome.uniformCrossover2(
      parentA.genome,
      parentB.genome,
      crossoverProb,
    );
    // Mutation event
    newDNA1.forEach((dna) => (dna.mutate(noise)));
    newDNA2.forEach((dna) => (dna.mutate(noise)));
    // Create the child Organisms
    const childA = Organism.createChild(parentA, parentB, newDNA1);
    const childB = Organism.createChild(parentA, parentB, newDNA2);

    if (flipCoin(0.1)) {
      childA.genome.mutateOrder();
    }
    if (flipCoin(0.1)) {
      childB.genome.mutateOrder();
    }

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

  clone() {
    return new Organism({
      genomeSize: this.genome.size,
      genome: this.genome.clone(),
      parentA: this.parentA,
      parentB: this.parentB,
    });
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
    this.children = [...this.children, child];
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
