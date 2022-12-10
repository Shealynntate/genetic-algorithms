import { flipCoin } from '../globals/statsUtils';
import DNA from './dna';
import Genome from './genome';

let count = -1;

const nextId = () => {
  count += 1;
  return count;
};

const Organism = {
  create: ({ id, size, genome = null }) => ({
    id: id ?? nextId(),
    genome: genome ?? Genome.create({ size }),
    fitness: 0,
  }),

  reproduce: (parentA, parentB, crossoverProb, noise) => {
    // Crossover event
    const [newDNA1, newDNA2] = Genome.uniformCrossover2(
      parentA.genome,
      parentB.genome,
      crossoverProb,
    );
    const size = newDNA1.length;
    // Mutation DNA
    for (let i = 0; i < size; ++i) {
      newDNA1[i] = DNA.mutate(newDNA1[i], noise);
      newDNA2[i] = DNA.mutate(newDNA2[i], noise);
    }
    // Mutate Genome
    const genomeA = Genome.create({ size, dna: newDNA1 });
    const genomeB = Genome.create({ size, dna: newDNA2 });
    if (flipCoin(0.1)) {
      Genome.mutateOrder(genomeA);
    }
    if (flipCoin(0.1)) {
      Genome.mutateOrder(genomeB);
    }

    // Create the child Organisms
    const childA = Organism.create({ genome: genomeA });
    const childB = Organism.create({ genome: genomeB });

    return [childA, childB];
  },

  clone: (organism) => Organism.create({
    genome: Genome.clone(organism.genome),
  }),

  evaluateFitness: (organism, target) => {
    // eslint-disable-next-line no-param-reassign
    organism.fitness = Genome.evaluateFitness(organism.genome, target);
    return organism.fitness;
  },
};

export default Organism;
