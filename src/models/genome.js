import { flipCoin, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import Chromosome from './chromosome';

const Genome = {
  create: ({ size, chromosomes }) => {
    const bases = chromosomes || genRange(size).map(() => Chromosome.create());
    return {
      size,
      chromosomes: bases,
    };
  },

  onePointCrossover: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    const index = flipCoin(prob) ? randomIndex(genome1.size) : -1;
    genRange(genome1.size).forEach((i) => {
      if (i >= index) {
        // Perform a crossover event
        child1.push(Chromosome.clone(genome2.chromosomes[i]));
        child2.push(Chromosome.clone(genome1.chromosomes[i]));
      } else {
        child1.push(Chromosome.clone(genome1.chromosomes[i]));
        child2.push(Chromosome.clone(genome2.chromosomes[i]));
      }
    });

    return [child1, child2];
  },

  twoPointCrossover: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    const doCrossover = flipCoin(prob);
    let index1 = doCrossover ? randomIndex(genome1.size) : -1;
    let index2 = doCrossover ? randomIndex(genome1.size) : -1;
    if (index2 < index1) {
      // Swap so index1 is always smaller than index2
      const temp = index1;
      index1 = index2;
      index2 = temp;
    }
    genRange(genome1.size).forEach((i) => {
      if (i >= index1 && i <= index2) {
        // Perform a crossover event
        child1.push(Chromosome.clone(genome2.chromosomes[i]));
        child2.push(Chromosome.clone(genome1.chromosomes[i]));
      } else {
        child1.push(Chromosome.clone(genome1.chromosomes[i]));
        child2.push(Chromosome.clone(genome2.chromosomes[i]));
      }
    });

    return [child1, child2];
  },

  // Crossover at the Gene level - keep the Chromosome intact
  uniformCrossover: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    genRange(genome1.size).forEach((i) => {
      if (flipCoin(prob)) {
        // Perform a crossover event
        child1.push(Chromosome.clone(genome2.chromosomes[i]));
        child2.push(Chromosome.clone(genome1.chromosomes[i]));
      } else {
        child1.push(Chromosome.clone(genome1.chromosomes[i]));
        child2.push(Chromosome.clone(genome2.chromosomes[i]));
      }
    });

    return [child1, child2];
  },

  // mutateOrder: (genome) => {
  //   const index1 = randomIndex(genome.size);
  //   const index2 = randomIndex(genome.size);
  //   if (index1 !== index2) {
  //     const r1 = genome.chromosomes.splice(index1, 1);
  //     const r2 = genome.chromosomes.splice(index2, 1, ...r1);
  //     genome.chromosomes.splice(index1, 0, ...r2);
  //   }
  // },

  // Swap adjacent Chromosome objects in the array
  mutateOrder: (genome) => {
    const index = randomIndex(genome.size - 1);
    const r1 = genome.chromosomes.splice(index, 1);
    genome.chromosomes.splice(index + 1, 0, ...r1);
  },

  mutateOrder2: (genome, mutation) => {
    const index = randomIndex(genome.size - 1);
    const [start, end] = mutation.permutationNudge(index);
    const patch = genome.chromosomes.splice(start, end - start).reverse();
    genome.chromosomes.splice(start, 0, ...patch);
  },

  clone: (genome) => Genome.create({
    size: genome.size, chromosomes: genome.chromosomes.map((d) => Chromosome.clone(d)),
  }),
};

export default Genome;
