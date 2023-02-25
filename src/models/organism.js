import { CrossoverType } from '../constants/typeDefinitions';
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
  create: ({
    id,
    size,
    numSides,
    genome = null,
  }) => ({
    id: id ?? nextId(),
    genome: genome ?? Genome.create({ size, numSides }),
    fitness: 0,
  }),

  reproduce: (parentA, parentB, crossover, mutation, bounds) => {
    // Crossover event
    const crossoverFunc = CrossoverFunctions[crossover.type];
    if (!crossoverFunc) {
      throw new Error(`Unrecognized crossover type ${crossover.type}`);
    }
    // Perform Crossover
    const [newChromosome1, newChromosome2] = crossoverFunc(
      parentA.genome.chromosomes,
      parentB.genome.chromosomes,
      crossover,
    );
    // Create the child Organisms
    const childA = Organism.create({ genome: Genome.create({ chromosomes: newChromosome1 }) });
    const childB = Organism.create({ genome: Genome.create({ chromosomes: newChromosome2 }) });
    // Mutate the new children
    Genome.mutate(childA.genome, mutation, bounds);
    Genome.mutate(childB.genome, mutation, bounds);

    return [childA, childB];
  },

  clone: (organism) => Organism.create({
    genome: Genome.clone(organism.genome),
  }),

  cloneAndMutate: (organism, mutation, bounds) => {
    const copy = Organism.clone(organism);
    Genome.mutate(copy.genome, mutation, bounds);
    return copy;
  },

  getLatestId: () => (count),

  // This occurs when rehydrating
  restoreId: (id) => { count = id; },
};

export default Organism;
