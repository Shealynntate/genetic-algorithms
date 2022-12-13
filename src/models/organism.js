import { CrossoverType } from '../constants';
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

  reproduce: (parentA, parentB, crossover, mutation) => {
    let newDNA1;
    let newDNA2;
    // Crossover event
    switch (crossover.type) {
      case CrossoverType.ONE_POINT:
        [newDNA1, newDNA2] = Genome.onePointCrossover(
          parentA.genome,
          parentB.genome,
          crossover.prob,
        );
        break;
      case CrossoverType.TWO_POINT:
        break;
      case CrossoverType.UNIFORM:
        [newDNA1, newDNA2] = Genome.uniformCrossover2(
          parentA.genome,
          parentB.genome,
          crossover.prob,
        );
        break;
      default:
        throw new Error(`Unrecognized crossover type ${crossover.type}`);
    }

    const size = newDNA1.length;
    // Mutation DNA
    for (let i = 0; i < size; ++i) {
      newDNA1[i] = DNA.mutate(newDNA1[i], mutation);
      newDNA2[i] = DNA.mutate(newDNA2[i], mutation);
    }
    // Mutate Genome
    const genomeA = Genome.create({ size, dna: newDNA1 });
    const genomeB = Genome.create({ size, dna: newDNA2 });
    if (mutation.doPermute()) {
      Genome.mutateOrder(genomeA);
    }
    if (mutation.doPermute()) {
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
};

export default Organism;
