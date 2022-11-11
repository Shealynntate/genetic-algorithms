import { genNumRange } from './utils';
import Phenotype from './phenotype';
import DNA from './dna';
import { canvasParameters } from '../constants';

//
const maxColorValue = 255;
const numColorChannels = 4;
const { width, height } = canvasParameters;

const denominator = maxColorValue * numColorChannels * width * height;

class Genome {
  static deserialize({ size, dna }) {
    return new Genome({
      size,
      dna: DNA.deserialize(dna),
    });
  }

  constructor({ size, dna }) {
    this.dna = dna || genNumRange(size).map(() => new DNA());
    this.phenotype = new Phenotype();
    this.phenotype.update(this.dna);
  }

  get size() {
    return this.dna.length;
  }

  subsequence(start, end) {
    return this.dna.slice(start, end);
  }

  evaluateFitness(target) {
    const pixels = this.phenotype.getPixels().data;
    if (pixels.length !== target.length) {
      console.error(
        `[Genome] target length ${target.length} does not match phenotype length ${pixels.length}`,
      );
      return -1;
    }
    let difference = 0;
    pixels.forEach((pixel, index) => {
      difference += Math.abs(pixel - target[index]);
    });

    return 1 - difference / denominator;
  }

  getPhenotype() {
    this.phenotype.update(this.dna);
    return this.phenotype.getPixels();
  }

  createNode() {
    return {
      size: this.size,
      dna: this.dna.map((base) => base.createNode()),
      phenotype: this.getPhenotype(),
    };
  }
}

export default Genome;
