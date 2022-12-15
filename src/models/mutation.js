import RandomNoise from '../globals/randomNoise';
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
    this.colorDist = new RandomNoise(colorSigma);
    this.pointDist = new RandomNoise(pointSigma);
    this.permuteDist = new RandomNoise(permuteSigma);
    this.permuteProb = permuteProb;
    this.prob = prob;
    this.genomeSize = genomeSize;

    this.addPointProb = 0.005;
    this.removePointProb = 0.005;
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
}

export default Mutation;
