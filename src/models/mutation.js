import GaussianNoise from '../globals/gaussianNoise';
import { flipCoin } from '../globals/statsUtils';

/**
 * Mutation
 */
class Mutation {
  constructor(data) {
    this.initialize(data);
  }

  initialize({
    prob,
    colorSigma,
    pointSigma,
    permuteSigma,
    permuteProb,
    addPointProb,
    removePointProb,
    resetChromosomeProb,
    addChromosomeProb,
    removeChromosomeProb,
    genomeSize,
  }) {
    this.colorDist = new GaussianNoise(colorSigma);
    this.pointDist = new GaussianNoise(pointSigma);
    this.permuteDist = new GaussianNoise(permuteSigma);
    this.permuteProb = permuteProb;
    this.prob = prob;
    this.genomeSize = genomeSize;
    this.addPointProb = addPointProb;
    this.removePointProb = removePointProb;
    this.resetChromosomeProb = resetChromosomeProb;
    this.addChromosomeProb = addChromosomeProb;
    this.removeChromosomeProb = removeChromosomeProb;
    this.prevMaxFitness = 0;
  }

  markNextGen({ genId, maxFitness }) {
    // if (maxFitness >= 0.945) {
    //   this.prob = 0.5;
    //   this.addPointProb = 0.01;
    //   this.removePointProb = 0.01;
    //   // this.permuteProb = 0.005;
    //   // this.resetChromosomeProb = 0.005;
    // }
    if (this.prevMaxFitness < 0.96 && maxFitness >= 0.96) {
      this.prob = 0.003;
      // this.addPointProb = 0.005;
      // this.removePointProb = 0.005;
      console.log('switching to 96% phase');
    }
    if (this.prevMaxFitness < 0.97 && maxFitness >= 0.97) {
      this.prob = 0.0025;
      this.permuteProb = 0.001;
      this.addPointProb = 0.001;
      this.removePointProb = 0.001;
      // this.permuteProb = 0.0015;
      // this.addPointProb = 0.0015;
      // this.removePointProb = 0.0015;
      // this.addChromosomeProb = 0.01;
      // this.removeChromosomeProb = 0.005;
      // this.prob = 0.0015; // 54000 generations, 0.9757 top score
      // this.colorSigma = 0.003;
      // this.pointSigma = 0.003;
      // this.colorDist = new GaussianNoise(this.colorSigma);
      // this.pointDist = new GaussianNoise(this.pointSigma);
      console.log('switching to 97% phase');
      // this.addPointProb = 0.001;
      // this.removePointProb = 0.001;
      // // this.addPointProb = 0.05;
      // // this.removePointProb = 0.05;
      // this.permuteProb = 0.002;
      // this.resetChromosomeProb = 0.0005;
    }
    if (this.prevMaxFitness < 0.975 && maxFitness >= 0.975) {
      this.prob = 0.0015;
      this.permuteProb = 0.001;
      this.addPointProb = 0.001;
      this.removePointProb = 0.001;
      console.log('switching to 97.5% phase');
    }
    if (genId > 100_000 || maxFitness > 0.99) {
      this.prob = 0.0001; // TODO: placeholder
    // Upodate Mutation Rate
    // const prob = 0.03;
    // if (gen.genId > 2_000) prob = 0.01;
    // if (gen.genId > 4_000) prob = 0.01;
    }
    this.prevMaxFitness = maxFitness;
  }

  // eslint-disable-next-line class-methods-use-this
  getMaxGenomeSize() {
    // if (this.prevMaxFitness < 0.91) {
    //   return 10;
    // }
    // if (this.prevMaxFitness < 0.93) {
    //   return 20;
    // }
    // if (this.prevMaxFitness < 0.945) {
    //   return 30;
    // }
    // if (this.prevMaxFitness < 0.955) {
    //   return 40;
    // }
    // if (this.prevMaxFitness < 0.965) {
    //   return 45;
    // }
    return 50;
  }

  serialize() {
    return {
      colorSigma: this.colorDist.getSigma(),
      pointSigma: this.pointDist.getSigma(),
      permuteSigma: this.permuteDist.getSigma(),
      prob: this.prob,
      permuteProb: this.permuteProb,
      genomeSize: this.genomeSize,
      addPointProb: this.addPointProb,
      removePointProb: this.removePointProb,
      resetChromosomeProb: this.resetChromosomeProb,
    };
  }

  deserialize(data) {
    this.initialize(data);
  }

  // eslint-disable-next-line no-unused-vars
  doMutate(size) {
    return flipCoin(this.prob);
  }

  // eslint-disable-next-line no-unused-vars
  doAddPoint(size) {
    return flipCoin(this.addPointProb);
  }

  // eslint-disable-next-line no-unused-vars
  doRemovePoint(size) {
    return flipCoin(this.removePointProb);
  }

  // eslint-disable-next-line no-unused-vars
  doPermute(size) {
    return flipCoin(this.permuteProb / size);
  }

  doResetChromosome() {
    return flipCoin(this.resetChromosomeProb);
  }

  // eslint-disable-next-line no-unused-vars
  doAddChromosome(size) {
    return flipCoin(this.addChromosomeProb / size);
  }

  // eslint-disable-next-line no-unused-vars
  doRemoveChromosome(size) {
    return flipCoin(this.removeChromosomeProb / size);
  }

  colorNudge() {
    return this.colorDist.next();
  }

  pointNudge() {
    return this.pointDist.next();
  }

  permutationNudge(index) {
    const dist = Math.round(this.permuteDist.next() * this.genomeSize);
    const start = dist > 0 ? index : Math.max(0, index + dist);
    const end = dist > 0 ? Math.min(this.genomeSize - 1, index + dist) : index;

    return [start, end];
  }

  setProbability(value) {
    this.prob = value;
  }

  setAddPointProb(value) {
    this.addPointProb = value;
  }

  setRemovePointProb(value) {
    this.removePointProb = value;
  }

  setPermuteProb(value) {
    this.permuteProb = value;
  }
}

export default Mutation;
