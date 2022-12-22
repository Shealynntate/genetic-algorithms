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
    this.prevMaxFitness = 0;
  }

  markNextGen({ genId, maxFitness }) {
    if (maxFitness >= 0.945) {
      this.prob = 0.5;
      this.addPointProb = 0.01;
      this.removePointProb = 0.01;
      // this.permuteProb = 0.005;
      // this.resetChromosomeProb = 0.005;
    }
    if (this.prevMaxFitness < 0.96 && maxFitness >= 0.96) {
      this.prob = 0.25;
      this.addPointProb = 0.005;
      this.removePointProb = 0.005;
      console.log('switching to 96% phase');
    }
    if (this.prevMaxFitness < 0.97 && maxFitness >= 0.97) {
      this.prob = 0.01;
      // this.colorSigma = 0.003;
      // this.pointSigma = 0.003;
      // this.colorDist = new GaussianNoise(this.colorSigma);
      // this.pointDist = new GaussianNoise(this.pointSigma);
      console.log('switching to 97% phase');
      // this.addPointProb = 0.001;
      // this.removePointProb = 0.001;
      // this.addPointProb = 0.05;
      // this.removePointProb = 0.05;
      this.permuteProb = 0.005;
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

  getMaxGenomeSize() {
    if (this.prevMaxFitness < 0.91) {
      return 10;
    }
    if (this.prevMaxFitness < 0.93) {
      return 20;
    }
    if (this.prevMaxFitness < 0.945) {
      return 30;
    }
    if (this.prevMaxFitness < 0.955) {
      return 40;
    }
    if (this.prevMaxFitness < 0.965) {
      return 45;
    }
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

  doMutate() {
    return flipCoin(this.prob);
  }

  doAddPoint() {
    return flipCoin(this.addPointProb);
  }

  doRemovePoint() {
    return flipCoin(this.removePointProb);
  }

  doPermute() {
    return flipCoin(this.permuteProb);
  }

  doResetChromosome() {
    return flipCoin(this.resetChromosomeProb);
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
