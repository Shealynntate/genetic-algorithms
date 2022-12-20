import { flipCoin, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import Chromosome from './chromosome';

const Genome = {
  create: ({ size, chromosomes }) => ({
    chromosomes: chromosomes || genRange(size).map(() => Chromosome.create()),
  }),

  onePointCrossover: (parent1, parent2, prob) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);
    // Choose a crossover index using the shorter of the two parents' lengths
    const index = flipCoin(prob) ? randomIndex(minLength) : -1;

    genRange(maxLength).forEach((i) => {
      if (i >= index) {
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

  twoPointCrossover: (parent1, parent2, prob) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);
    const doCrossover = flipCoin(prob);
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

  uniformCrossover: (parent1, parent2, prob) => {
    const child1 = [];
    const child2 = [];
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.length, parent2.length);
    const maxLength = Math.max(parent1.length, parent2.length);

    genRange(maxLength).forEach((i) => {
      if (i < minLength && flipCoin(prob)) {
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

  clone: (genome) => Genome.create({
    chromosomes: genome.chromosomes.map((d) => Chromosome.clone(d)),
  }),
};

export default Genome;
