import { CrossoverType } from '../constants';
import Chromosome from './chromosome';
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

    const [newChromosome1, newChromosome2] = crossoverFunc(
      parentA.genome,
      parentB.genome,
      crossover.prob,
    );
    const size = newChromosome1.length;
    // Mutate Chromosome
    for (let i = 0; i < size; ++i) {
      if (mutation.doMutate()) {
        newChromosome1[i] = Chromosome.mutate1(newChromosome1[i], mutation);
      }
      if (mutation.doMutate()) {
        newChromosome2[i] = Chromosome.mutate1(newChromosome2[i], mutation);
      }
    }
    // for (let i = 0; i < size; ++i) {
    //   newChromosome1[i] = Chromosome.mutate(newChromosome1[i], mutation);
    //   newChromosome2[i] = Chromosome.mutate(newChromosome2[i], mutation);
    // }
    // Mutate Genome
    const genomeA = Genome.create({ size, chromosomes: newChromosome1 });
    const genomeB = Genome.create({ size, chromosomes: newChromosome2 });
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

  getLatestId: () => (count),

  // This occurs when rehydrating
  restoreId: (id) => { count = id; },
};

export default Organism;
