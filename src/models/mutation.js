import { DistributionTypes, MutationProbabilities, ProbabilityTypes } from '../constants';
import GaussianNoise from '../globals/gaussianNoise';
import { flipCoin } from '../globals/statsUtils';
import { computeProb } from '../globals/utils';

/**
 * Mutation
 */
class Mutation {
  constructor({
    probabilities,
    genomeSize,
    ...params
  }) {
    this.colorDist = new GaussianNoise(params[DistributionTypes.COLOR_SIGMA]);
    this.pointDist = new GaussianNoise(params[DistributionTypes.POINT_SIGMA]);
    this.permuteDist = new GaussianNoise(params[DistributionTypes.PERMUTE_SIGMA]);
    this.probabilities = probabilities;
    this.genomeSize = genomeSize;
    this.computeProbabilities(0);
    this.isDisruptionGen = false;
  }

  serialize() {
    return {
      [DistributionTypes.COLOR_SIGMA]: this.colorDist.getSigma(),
      [DistributionTypes.POINT_SIGMA]: this.pointDist.getSigma(),
      [DistributionTypes.PERMUTE_SIGMA]: this.permuteDist.getSigma(),
      genomeSize: this.genomeSize,
      probabilities: this.probabilities,
    };
  }

  computeProbabilities(maxFitness) {
    MutationProbabilities.forEach((type) => {
      this[type] = computeProb(this.probabilities[type], maxFitness);
    });
  }

  markDisruptionGen() {
    this.isDisruptionGen = true;
  }

  markNextGen({ maxFitness }) {
    // Recompute probabilities
    this.computeProbabilities(maxFitness);
    this.isDisruptionGen = false;
  }

  doTweakPoint() {
    if (this.isDisruptionGen) {
      return flipCoin(0.1);
    }
    return flipCoin(this[ProbabilityTypes.TWEAK_POINT]);
  }

  doTweakColor() {
    if (this.isDisruptionGen) {
      return flipCoin(0.25);
    }
    return flipCoin(this[ProbabilityTypes.TWEAK_COLOR]);
  }

  doAddPoint() {
    if (this.isDisruptionGen) {
      return flipCoin(this.probabilities[ProbabilityTypes.ADD_POINT].startValue);
    }
    return flipCoin(this[ProbabilityTypes.ADD_POINT]);
  }

  doRemovePoint() {
    if (this.isDisruptionGen) {
      return flipCoin(this.probabilities[ProbabilityTypes.REMOVE_POINT].startValue);
    }
    return flipCoin(this[ProbabilityTypes.REMOVE_POINT]);
  }

  doAddChromosome() {
    return flipCoin(this[ProbabilityTypes.ADD_CHROMOSOME]);
  }

  doRemoveChromosome() {
    return flipCoin(this[ProbabilityTypes.REMOVE_CHROMOSOME]);
  }

  doResetChromosome() {
    if (this.isDisruptionGen) {
      return flipCoin(0.1);
    }
    return flipCoin(this[ProbabilityTypes.RESET_CHROMOSOME]);
  }

  doPermute() {
    return flipCoin(this[ProbabilityTypes.PERMUTE_CHROMOSOMES]);
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
