import { DistributionTypes, ProbabilityTypes } from '../constants/typeDefinitions';
import { MutationProbabilities } from '../constants/constants';
import GaussianNoise from '../utils/gaussianNoise';
import { computeProb, flipCoin } from '../utils/statsUtils';

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
    this.isSinglePoint = params.isSinglePoint;
    this.computeProbabilities(0);
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

  markNextGen({ maxFitness }) {
    // Recompute probabilities
    this.computeProbabilities(maxFitness);
  }

  /**
   * Called when using Single Point mutation to determine
   * if a chromosome should mutate one of its fields
   * @returns true if the mutation should occur, false otherwise
   */
  doTweak() {
    return flipCoin(this[ProbabilityTypes.TWEAK]);
  }

  doTweakPoint() {
    return flipCoin(this[ProbabilityTypes.TWEAK_POINT]);
  }

  doTweakColor() {
    return flipCoin(this[ProbabilityTypes.TWEAK_COLOR]);
  }

  doAddPoint() {
    return flipCoin(this[ProbabilityTypes.ADD_POINT]);
  }

  doRemovePoint() {
    return flipCoin(this[ProbabilityTypes.REMOVE_POINT]);
  }

  doAddChromosome() {
    return flipCoin(this[ProbabilityTypes.ADD_CHROMOSOME]);
  }

  doRemoveChromosome() {
    return flipCoin(this[ProbabilityTypes.REMOVE_CHROMOSOME]);
  }

  doResetChromosome() {
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
