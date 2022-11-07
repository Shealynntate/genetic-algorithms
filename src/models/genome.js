import { genNumRange } from './utils';
import Phenotype from './phenotype';
import DNA from './dna';

//
class Genome {
  constructor({ size, dna }) {
    this.dna = dna || genNumRange(size).map(() => new DNA());
    this.phenotype = new Phenotype();
    this.phenotype.update(this.dna);
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

    return difference / 255;
  }

  getPhenotype() {
    this.phenotype.update(this.dna);
    return this.phenotype.getPixels();
  }
}

export default Genome;
