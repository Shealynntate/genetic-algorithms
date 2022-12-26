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
    colorSigma,
    pointSigma,
    permuteSigma,
    probMap,
    genomeSize,
  }) {
    this.colorDist = new GaussianNoise(colorSigma);
    this.pointDist = new GaussianNoise(pointSigma);
    this.permuteDist = new GaussianNoise(permuteSigma);
    this.probMap = probMap;
    this.genomeSize = genomeSize;
    this.prevMaxFitness = -1;
    this.markNextGen({ maxFitness: 0 });
  }

  markNextGen({ maxFitness }) {
    this.probMap.forEach(({ threshold, values }) => {
      if (this.prevMaxFitness < threshold && maxFitness >= threshold) {
        Object.keys(values).forEach((prob) => {
          this[prob] = values[prob];
        });
      }
    });
    this.prevMaxFitness = maxFitness;
  }

  serialize() {
    return {
      colorSigma: this.colorDist.getSigma(),
      pointSigma: this.pointDist.getSigma(),
      permuteSigma: this.permuteDist.getSigma(),
      genomeSize: this.genomeSize,
      probMap: this.probMap,
    };
  }

  deserialize(data) {
    this.initialize(data);
  }

  // eslint-disable-next-line no-unused-vars
  doMutate(size) {
    return flipCoin(this.tweakProb);
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

  setTweakProbability(value) {
    this.tweakProb = value;
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
