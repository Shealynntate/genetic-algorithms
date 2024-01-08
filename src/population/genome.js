import { genRange } from '../utils/utils.ts';
import { randomIndex } from '../utils/statsUtils';
import Chromosome from './chromosome';
import { CrossoverType } from '../constants/typeDefinitions';

const Genome = {
  // Creation Methods
  // ------------------------------------------------------------
  create: ({ size, chromosomes, numSides }) => ({
    chromosomes: chromosomes || genRange(size).map(() => Chromosome.create({ numSides })),
  }),

  clone: (genome) => Genome.create({
    chromosomes: genome.chromosomes.map((d) => Chromosome.clone(d)),
  }),

  // Crossover Methods
  // ------------------------------------------------------------
  crossover: (parent1, parent2, crossover) => {
    let func;
    switch (crossover.type) {
      case CrossoverType.ONE_POINT:
        func = Genome.onePointCrossover;
        break;
      case CrossoverType.TWO_POINT:
        func = Genome.twoPointCrossover;
        break;
      case CrossoverType.UNIFORM:
        func = Genome.uniformCrossover;
        break;
      default:
        throw new Error(`Unrecognized crossover type ${crossover.type}`);
    }
    return func(parent1, parent2, crossover);
  },

  onePointCrossover: (parent1, parent2, crossover) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);
    // Choose a crossover index using the shorter of the two parents' lengths
    const index = crossover.doCrossover() ? randomIndex(minLength) : -1;

    genRange(maxLength).forEach((i) => {
      if (index >= 0 && i <= index) {
        // Perform a crossover event
        child1.push(Chromosome.clone(parent2[i]));
        child2.push(Chromosome.clone(parent1[i]));
      } else {
        if (i < parent1.length) {
          child1.push(Chromosome.clone(parent1[i]));
        }
        if (i < parent2.length) {
          child2.push(Chromosome.clone(parent2[i]));
        }
      }
    });

    return [child1, child2];
  },

  twoPointCrossover: (parent1, parent2, crossover) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);
    const doCrossover = crossover.doCrossover();
    // Choose a crossover indices using the shorter of the two parents' lengths
    let index1 = doCrossover ? randomIndex(minLength) : -1;
    let index2 = doCrossover ? randomIndex(minLength) : -1;
    if (index2 < index1) {
      // Swap so index1 is always smaller than index2
      const temp = index1;
      index1 = index2;
      index2 = temp;
    }
    genRange(maxLength).forEach((i) => {
      if (i >= index1 && i <= index2) {
        // Perform a crossover event
        child1.push(Chromosome.clone(parent2[i]));
        child2.push(Chromosome.clone(parent1[i]));
      } else {
        if (i < parent1.length) {
          child1.push(Chromosome.clone(parent1[i]));
        }
        if (i < parent2.length) {
          child2.push(Chromosome.clone(parent2[i]));
        }
      }
    });

    return [child1, child2];
  },

  uniformCrossover: (parent1, parent2, crossover) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);

    genRange(maxLength).forEach((i) => {
      if (i < minLength && crossover.doCrossover()) {
        // Perform a crossover event
        child1.push(Chromosome.clone(parent2[i]));
        child2.push(Chromosome.clone(parent1[i]));
      } else {
        if (i < parent1.length) {
          child1.push(Chromosome.clone(parent1[i]));
        }
        if (i < parent2.length) {
          child2.push(Chromosome.clone(parent2[i]));
        }
      }
    });

    return [child1, child2];
  },

  // Mutation Methods
  // ------------------------------------------------------------
  mutate: (genome, mutation, bounds) => {
    const { maxPoints, minPoints, maxGenomeSize } = bounds;
    const { chromosomes } = genome;
    // Mutate at the genome level

    // Check add chromosome mutation
    if (chromosomes.length < maxGenomeSize && mutation.doAddChromosome()) {
      chromosomes.push(Chromosome.create({ numSides: minPoints }));
    }

    // Check remove chromosome mutation
    if (chromosomes.length > 1 && mutation.doRemoveChromosome()) {
      // Delete the chromosome
      const index = randomIndex(chromosomes.length);
      chromosomes.splice(index, 1);
    }

    // Check full reset mutation
    if (mutation.doResetChromosome()) {
      const index = randomIndex(chromosomes.length);
      Chromosome.resetMutation(chromosomes[index], minPoints);
      const c = chromosomes.splice(index, 1);
      // Reset it to the top of the array
      chromosomes.push(...c);
    }

    // Mutate Genome
    if (mutation.doPermute()) {
      Genome.mutateOrder(genome, mutation);
    }

    // Mutate at the chromosome level
    for (let i = 0; i < chromosomes.length; ++i) {
      // Check add point mutation
      if (mutation.doAddPoint()) {
        Chromosome.addPointMutation(chromosomes[i], maxPoints);
      }
      // Check remove point mutation
      if (mutation.doRemovePoint()) {
        Chromosome.removePointMutation(chromosomes[i], minPoints);
      }
      // Check tweak values mutation
      if (mutation.isSinglePoint) {
        if (mutation.doTweak()) {
          chromosomes[i] = Chromosome.tweakMutationSinglePoint(chromosomes[i], mutation);
        }
      } else {
        chromosomes[i] = Chromosome.tweakMutationUniform(chromosomes[i], mutation);
      }
    }
  },

  // Swap a random range of adjacent Chromosome objects in the array
  mutateOrder: (genome, mutation) => {
    const index = randomIndex(genome.chromosomes.length - 1);
    const [start, end] = mutation.permutationNudge(index);
    const patch = genome.chromosomes.splice(start, end - start).reverse();
    genome.chromosomes.splice(start, 0, ...patch);
  },
};

export default Genome;
