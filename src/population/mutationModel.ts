import {
  type MutationProbabilities,
  type Mutation,
  type DistributionMap
} from './types'
import GaussianNoise from '../utils/gaussianNoise'
import { flipCoin } from '../utils/statsUtils'

/**
 * Mutation
 */
class MutationModel {
  colorDist: GaussianNoise
  pointDist: GaussianNoise
  probabilities: MutationProbabilities
  distributions: DistributionMap
  genomeSize: number

  constructor(parameters: Mutation) {
    const { distributions } = parameters
    this.distributions = distributions
    this.colorDist = new GaussianNoise(0, distributions.colorSigma)
    this.pointDist = new GaussianNoise(0, distributions.pointSigma)
    this.genomeSize = parameters.genomeSize
    this.probabilities = parameters.probabilities
  }

  doTweakPoint(): boolean {
    return flipCoin(this.probabilities.tweakPoint)
  }

  doTweakColor(): boolean {
    return flipCoin(this.probabilities.tweakColor)
  }

  doAddPoint(): boolean {
    return flipCoin(this.probabilities.addPoint)
  }

  doRemovePoint(): boolean {
    return flipCoin(this.probabilities.removePoint)
  }

  doAddChromosome(): boolean {
    return flipCoin(this.probabilities.addChromosome)
  }

  doRemoveChromosome(): boolean {
    return flipCoin(this.probabilities.removeChromosome)
  }

  doPermute(): boolean {
    return flipCoin(this.probabilities.permuteChromosomes)
  }

  colorNudge(): number {
    return this.colorDist.next()
  }

  pointNudge(): number {
    return this.pointDist.next()
  }

  serialize(): Mutation {
    return {
      genomeSize: this.genomeSize,
      distributions: this.distributions,
      probabilities: this.probabilities
    }
  }
}

export default MutationModel
