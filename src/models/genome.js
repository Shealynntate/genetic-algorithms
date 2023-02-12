import { randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import Chromosome from './chromosome';

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
    const isSingleMutation = false;
    // Mutate at the chromosomal level

    // Check add chromosome mutation
    if (chromosomes.length < maxGenomeSize && mutation.doAddChromosome()) {
      chromosomes.push(Chromosome.create({ numSides: minPoints }));
    }

    for (let i = 0; i < chromosomes.length; ++i) {
      // Check full reset mutation
      if (mutation.doResetChromosome()) {
        Chromosome.resetMutation(chromosomes[i], minPoints);
      }
      // Check remove chromosome mutation
      if (mutation.doRemoveChromosome()) {
        // Delete the chromosome
        if (chromosomes.length > 1) {
          chromosomes.splice(i, 1);
          if (i >= chromosomes.length) break;
        }
      }
      // Check add point mutation
      if (mutation.doAddPoint()) {
        if (!Chromosome.addPointMutation(chromosomes[i], maxPoints)) {
          // Split into two
          // const daughters = Chromosome.mitosis(chromosomes[i]);
          // if (chromosomes.length < maxGenomeSize) {
          //   chromosomes.splice(i, 1, ...daughters);
          // } else {
          //   chromosomes.splice(i, 1, daughters[0]);
          // }
        }
      }
      // Check remove point mutation
      if (mutation.doRemovePoint()) {
        if (!Chromosome.removePointMutation(chromosomes[i], minPoints)) {
          // Delete the chromosome
          // if (chromosomes.length > 1) {
          //   chromosomes.splice(i, 1);
          //   if (i >= chromosomes.length) break;
          // }
        }
      }
      // Check tweak values mutation
      if (isSingleMutation) {
        if (mutation.doTweakPoint(chromosomes.length)) { // TODO: Fix mutation call
          chromosomes[i] = Chromosome.singleMutation(chromosomes[i], mutation);
        }
      } else {
        chromosomes[i] = Chromosome.multiMutation(chromosomes[i], mutation);
      }
    }

    // Mutate Genome
    if (mutation.doPermute()) {
      Genome.mutateOrder2(genome, mutation);
    }
  },

  // Swap adjacent Chromosome objects in the array
  mutateOrder: (genome) => {
    const index = randomIndex(genome.chromosomes.length - 1);
    const r1 = genome.chromosomes.splice(index, 1);
    genome.chromosomes.splice(index + 1, 0, ...r1);
  },

  mutateOrder2: (genome, mutation) => {
    const index = randomIndex(genome.chromosomes.length - 1);
    const [start, end] = mutation.permutationNudge(index);
    const patch = genome.chromosomes.splice(start, end - start).reverse();
    genome.chromosomes.splice(start, 0, ...patch);
  },
};

export default Genome;
