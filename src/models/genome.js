import { flipCoin, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import Phenotype from './phenotype';
import DNA from './dna';
import { canvasParameters, maxColorValue, numColorChannels } from '../constants';

//
const { width, height } = canvasParameters;

const denominator = maxColorValue * numColorChannels * width * height;

const Phenome = new Phenotype();

const Genome = {
  create: ({ size, dna }) => {
    const bases = dna || genRange(size).map(() => DNA.create());
    return {
      size,
      dna: bases,
      phenotype: Phenome.getImageData(bases),
    };
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

  evaluateFitness: (genome, target) => {
    const { data: pixels } = genome.phenotype;
    if (pixels.length !== target.length) {
      throw new Error(`[Genome] target length ${target.length} does not match phenotype length ${pixels.length}`);
    }

    let difference = 0;
    // Note: This for-loop is an order of magnitude faster than Array.prototype.forEach
    // Super important here since each length is tens of thousands of pixels per organism
    for (let i = 0; i < pixels.length; i++) {
      difference += Math.abs(pixels[i] - target[i]);
    }

    return (1 - difference / denominator);
  },

  mutateOrder: (genome) => {
    const index1 = randomIndex(genome.size);
    const index2 = randomIndex(genome.size);
    if (index1 !== index2) {
      const r1 = genome.dna.splice(index1, 1);
      const r2 = genome.dna.splice(index2, 1, ...r1);
      genome.dna.splice(index1, 0, ...r2);
    }
  },

  clone: (genome) => Genome.create({ size: genome.size, dna: genome.dna.map((d) => d.clone()) }),
};

export default Genome;
