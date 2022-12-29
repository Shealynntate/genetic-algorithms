import { MutationProbabilityTypes } from '../constants';
import GaussianNoise from '../globals/gaussianNoise';
import { flipCoin } from '../globals/statsUtils';

const computeProb = ({
  startValue,
  endValue,
  startFitness,
  endFitness,
}, fitness) => {
  if (fitness <= startFitness) return startValue;
  if (fitness >= endFitness) return endValue;
  return startValue + fitness * ((endValue - startValue) / (endFitness - startFitness));
};

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

  markNextGen({ maxFitness }) {
    this.maxFitness = maxFitness;
  }

  doMutate() {
    const prob = computeProb(this.probMap[MutationProbabilityTypes.TWEAK], this.maxFitness);
    return flipCoin(prob);
  }

  doAddPoint() {
    const prob = computeProb(this.probMap[MutationProbabilityTypes.ADD_POINT], this.maxFitness);
    return flipCoin(prob);
  }

  doRemovePoint() {
    const prob = computeProb(this.probMap[MutationProbabilityTypes.REMOVE_POINT], this.maxFitness);
    return flipCoin(prob);
  }

  doAddChromosome() {
    const prob = computeProb(
      this.probMap[MutationProbabilityTypes.ADD_CHROMOSOME],
      this.maxFitness,
    );
    return flipCoin(prob);
  }

  doRemoveChromosome() {
    const prob = computeProb(
      this.probMap[MutationProbabilityTypes.REMOVE_CHROMOSOME],
      this.maxFitness,
    );
    return flipCoin(prob);
  }

  doResetChromosome() {
    const prob = computeProb(
      this.probMap[MutationProbabilityTypes.RESET_CHROMOSOME],
      this.maxFitness,
    );
    return flipCoin(prob);
  }

  doPermute() {
    const prob = computeProb(
      this.probMap[MutationProbabilityTypes.PERMUTE_CHROMOSOMES],
      this.maxFitness,
    );
    return flipCoin(prob);
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
}

export default Mutation;
