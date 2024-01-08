import {
  type CrossoverProbabilities,
  type CrossoverParameters,
  type Crossover,
  type CrossoverProbabilityParameters,
  type CrossoverType
} from './types'
import { computeProb, flipCoin } from '../utils/statsUtils'
import { objectKeys } from '../utils/utils'

/**
 * Crossover
 */
class CrossoverModel {
  type: CrossoverType
  probabilityParameters: CrossoverProbabilityParameters
  probabilities: CrossoverProbabilities

  constructor ({ type, probabilityParameters }: CrossoverParameters) {
    this.type = type
    this.probabilityParameters = probabilityParameters
    this.probabilities = { swap: 0 }
    this.computeProbabilities(0)
  }

  computeProbabilities (maxFitness: number): void {
    objectKeys(this.probabilityParameters).forEach((type) => {
      this.probabilities[type] = computeProb(this.probabilityParameters[type], maxFitness)
    })
  }

  markNextGen (maxFitness: number): void {
    // Recompute probabilities
    this.computeProbabilities(maxFitness)
  }

  doCrossover (): boolean {
    return flipCoin(this.probabilities.swap)
  }

  serialize (): Crossover {
    return {
      type: this.type,
      probabilityParameters: this.probabilityParameters,
      probabilities: this.probabilities
    }
  }
}

export default CrossoverModel
