import { flipCoin, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import DNA from './dna';

const Genome = {
  create: ({ size, dna }) => {
    const bases = dna || genRange(size).map(() => DNA.create());
    return {
      size,
      dna: bases,
    };
  },

  onePointCrossover: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    const index = flipCoin(prob) ? randomIndex(genome1.size) : -1;
    genRange(genome1.size).forEach((i) => {
      if (i >= index) {
        // Perform a crossover event
        child1.push(DNA.clone(genome2.dna[i]));
        child2.push(DNA.clone(genome1.dna[i]));
      } else {
        child1.push(DNA.clone(genome1.dna[i]));
        child2.push(DNA.clone(genome2.dna[i]));
      }
    });

    return [child1, child2];
  },

  uniformCrossover: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    genRange(genome1.size).forEach((i) => {
      const [a, b] = DNA.uniformCrossover(genome1.dna[i], genome2.dna[i], prob);
      child1.push(a);
      child2.push(b);
    });
    return [child1, child2];
  },

  // Crossover at the Gene level - keep the DNA intact
  uniformCrossover2: (genome1, genome2, prob) => {
    const child1 = [];
    const child2 = [];
    genRange(genome1.size).forEach((i) => {
      if (flipCoin(prob)) {
        // Perform a crossover event
        child1.push(DNA.clone(genome2.dna[i]));
        child2.push(DNA.clone(genome1.dna[i]));
      } else {
        child1.push(DNA.clone(genome1.dna[i]));
        child2.push(DNA.clone(genome2.dna[i]));
      }
    });

    return [child1, child2];
  },

  // mutateOrder: (genome) => {
  //   const index1 = randomIndex(genome.size);
  //   const index2 = randomIndex(genome.size);
  //   if (index1 !== index2) {
  //     const r1 = genome.dna.splice(index1, 1);
  //     const r2 = genome.dna.splice(index2, 1, ...r1);
  //     genome.dna.splice(index1, 0, ...r2);
  //   }
  // },

  // Swap adjacent DNA objects in the array
  mutateOrder: (genome) => {
    const index = randomIndex(genome.size - 1);
    const r1 = genome.dna.splice(index, 1);
    genome.dna.splice(index + 1, 0, ...r1);
  },

  clone: (genome) => Genome.create({ size: genome.size, dna: genome.dna.map((d) => DNA.clone(d)) }),
};

export default Genome;
