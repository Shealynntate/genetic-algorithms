import { flipCoin, randomIndex } from '../globals/statsUtils';
import { genRange } from '../globals/utils';
import Phenotype from './phenotype';
import DNA from './dna';
import { canvasParameters, maxColorValue } from '../constants';

//
const numColorChannels = 4;
const { width, height } = canvasParameters;

const denominator = maxColorValue * numColorChannels * width * height;

class Genome {
  static phenotype = new Phenotype();

  static deserialize({ size, dna }) {
    return new Genome({
      size,
      dna: dna.map((base) => DNA.deserialize(base)),
    });
  }

  static uniformCrossover(genome1, genome2, prob) {
    const child1 = [];
    const child2 = [];
    genRange(genome1.size).forEach((i) => {
      const [a, b] = DNA.uniformCrossover(genome1.dna[i], genome2.dna[i], prob);
      child1.push(a);
      child2.push(b);
    });
    return [child1, child2];
  }

  // Crossover at the Gene level - keep the DNA intact
  static uniformCrossover2(genome1, genome2, prob) {
    const child1 = [];
    const child2 = [];
    genRange(genome1.size).forEach((i) => {
      if (flipCoin(prob)) {
        // Perform a crossover event
        child1.push(genome2.dna[i].clone());
        child2.push(genome1.dna[i].clone());
      } else {
        child1.push(genome1.dna[i].clone());
        child2.push(genome2.dna[i].clone());
      }
    });

    return [child1, child2];
  }

  constructor({ size, dna }) {
    this.dna = dna || genRange(size).map(() => new DNA());
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
  }

  // mutateOrder() {
  //   const index = randomIndex(this.size);
  //   const removed = this.dna.splice(index, 1);
  //   this.dna.push(...removed);
  // }

  mutateOrder() {
    const index1 = randomIndex(this.size);
    const index2 = randomIndex(this.size);
    if (index1 !== index2) {
      const r1 = this.dna.splice(index1, 1);
      const r2 = this.dna.splice(index2, 1, ...r1);
      this.dna.splice(index1, 0, ...r2);
      // console.log('mutateOrder', {
      //   index1, index2, r1, r2, dna: this.dna,
      // });
    }
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
