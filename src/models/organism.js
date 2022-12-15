import { CrossoverType } from '../constants';
import DNA from './dna';
import Genome from './genome';

const CrossoverFunctions = {
  [CrossoverType.ONE_POINT]: Genome.onePointCrossover,
  [CrossoverType.TWO_POINT]: Genome.twoPointCrossover,
  [CrossoverType.UNIFORM]: Genome.uniformCrossover,
};

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

  // eslint-disable-next-line no-unused-vars
  reproduce: (parentA, parentB, crossover, mutation, genId) => {
    // Crossover event
    const crossoverFunc = CrossoverFunctions[crossover.type];
    if (!crossoverFunc) {
      throw new Error(`Unrecognized crossover type ${crossover.type}`);
    }

    const [newDNA1, newDNA2] = crossoverFunc(parentA.genome, parentB.genome, crossover.prob);
    const size = newDNA1.length;
    // Mutate DNA
    for (let i = 0; i < size; ++i) {
      if (mutation.doMutate()) {
        newDNA1[i] = DNA.mutate(newDNA1[i], mutation);
      }
      if (mutation.doMutate()) {
        newDNA2[i] = DNA.mutate(newDNA2[i], mutation);
      }
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
