import { flipCoin, genNumRange } from '../globals/utils';
import Phenotype from './phenotype';
import DNA from './dna';
import { canvasParameters } from '../constants';

//
const maxColorValue = 255;
const numColorChannels = 4;
const { width, height } = canvasParameters;

const denominator = maxColorValue * numColorChannels * width * height;

class Genome {
  static phenotype = new Phenotype();

  static deserialize({ size, dna }) {
    return new Genome({
      size,
      dna: DNA.deserialize(dna),
    });
  }

  static uniformCrossover(genome1, genome2, prob) {
    const child1 = [];
    const child2 = [];
    genNumRange(genome1.size).forEach((i) => {
      const [a, b] = DNA.uniformCrossover(genome1.dna[i], genome2.dna[i], prob);
      child1.push(a);
      child2.push(b);
    });
    return [child1, child2];
  }

  // Crossover at the Gene level - keep the DNA intact
  static uniformCrossover2(genome1, genome2, prob) {
    const child1 = genome1.dna.map((d) => d.clone());
    const child2 = genome2.dna.map((d) => d.clone());
    genNumRange(genome1.size).forEach((i) => {
      if (flipCoin(prob)) {
        const temp = child1[i];
        child1[i] = child2[i];
        child2[i] = temp;
      }
    });
    return [child1, child2];
  }

  constructor({ size, dna }) {
    this.dna = dna || genNumRange(size).map(() => new DNA());
    this.phenotype = Genome.phenotype.getImageData(this.dna);
  }

  get size() {
    return this.dna.length;
  }

  subsequence(start, end) {
    return this.dna.slice(start, end);
  }

  evaluateFitness(target) {
    const pixels = this.phenotype.data;
    // console.log(this.phenotype);
    if (pixels.length !== target.length) {
      throw new Error(`[Genome] target length ${target.length} does not match phenotype length ${pixels.length}`);
    }

    let difference = 0;
    pixels.forEach((pixel, index) => {
      difference += Math.abs(pixel - target[index]);
    });

    return (1 - difference / denominator);
  }

  getPhenotype() {
    return this.phenotype;
  }

  createNode() {
    return {
      size: this.size,
      dna: this.dna.map((base) => base.createNode()),
    };
  }

  clone() {
    return new Genome({ size: this.size, dna: this.dna.map((d) => d.clone()) });
  }
}

export default Genome;
