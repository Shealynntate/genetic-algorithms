import { type Crossover, type CrossoverProbabilities, type CrossoverType } from './types'
import { flipCoin } from '../utils/statsUtils'

/**
 * Crossover
 */
class CrossoverModel {
  type: CrossoverType
  probabilities: CrossoverProbabilities

  constructor ({ type, probabilities }: Crossover) {
    this.type = type
    this.probabilities = probabilities
  }

  doCrossover (): boolean {
    return flipCoin(this.probabilities.swap)
  }

  serialize (): Crossover {
    return {
      type: this.type,
      probabilities: this.probabilities
    }
  }
}

export default CrossoverModel
