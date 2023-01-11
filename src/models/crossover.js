import { CrossoverProbabilities, ProbabilityTypes } from '../constants';
import { flipCoin } from '../globals/statsUtils';
import { computeProb } from '../globals/utils';

/**
 * Crossover
 */
class Crossover {
  constructor({ type, probabilities }) {
    this.type = type;
    this.probabilities = probabilities;
    this.computeProbabilities(0);
  }

  serialize() {
    return {
      type: this.type,
      probabilities: this.probabilities,
    };
  }

  computeProbabilities(maxFitness) {
    CrossoverProbabilities.forEach((type) => {
      this[type] = computeProb(this.probabilities[type], maxFitness);
    });
  }

  markNextGen({ maxFitness }) {
    // Recompute probabilities
    this.computeProbabilities(maxFitness);
  }

  doCrossover() {
    return flipCoin(this[ProbabilityTypes.SWAP]);
  }
}

export default Crossover;
