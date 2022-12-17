import GaussianNoise from '../globals/gaussianNoise';
import { flipCoin } from '../globals/statsUtils';

/**
 * Mutation
 */
class Mutation {
  constructor({
    colorSigma,
    pointSigma,
    permuteSigma,
    permuteProb,
    prob,
    genomeSize,
  }) {
    this.colorDist = new GaussianNoise(colorSigma);
    this.pointDist = new GaussianNoise(pointSigma);
    this.permuteDist = new GaussianNoise(permuteSigma);
    this.permuteProb = permuteProb;
    this.prob = prob;
    this.genomeSize = genomeSize;

    this.addPointProb = 0.008;
    this.removePointProb = 0.008;
    this.resetDNAProb = 0.0067;
  }

  markNextGen({ genId, maxFitness }) {
    if (maxFitness >= 0.965) {
      // this.prob = 0.015;
    }
    if (genId > 100_000 || maxFitness > 0.99) {
      this.prob = 0.0001; // TODO: placeholder
    // Upodate Mutation Rate
    // const prob = 0.03;
    // if (gen.genId > 2_000) prob = 0.01;
    // if (gen.genId > 4_000) prob = 0.01;
    }
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

  doResetDNA() {
    return flipCoin(this.resetDNAProb);
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
