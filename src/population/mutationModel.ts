import { type MutationProbabilities, type Mutation, type DistributionMap } from './types'
import GaussianNoise from '../utils/gaussianNoise'
import { flipCoin } from '../utils/statsUtils'

/**
 * Mutation
 */
class MutationModel {
  colorDist: GaussianNoise
  pointDist: GaussianNoise
  permuteDist: GaussianNoise
  probabilities: MutationProbabilities
  distributions: DistributionMap
  genomeSize: number
  isSinglePoint: boolean

  constructor (parameters: Mutation) {
    const { distributions } = parameters
    this.distributions = distributions
    this.colorDist = new GaussianNoise(distributions.colorSigma)
    this.pointDist = new GaussianNoise(distributions.pointSigma)
    this.permuteDist = new GaussianNoise(distributions.permuteSigma)
    this.genomeSize = parameters.genomeSize
    this.isSinglePoint = parameters.isSinglePoint
    this.probabilities = parameters.probabilities
  }

  /**
   * Called when using Single Point mutation to determine
   * if a chromosome should mutate one of its fields
   * @returns true if the mutation should occur, false otherwise
   */
  doTweak (): boolean {
    return flipCoin(this.probabilities.tweak)
  }

  doTweakPoint (): boolean {
    return flipCoin(this.probabilities.tweakPoint)
  }

  doTweakColor (): boolean {
    return flipCoin(this.probabilities.tweakColor)
  }

  doAddPoint (): boolean {
    return flipCoin(this.probabilities.addPoint)
  }

  doRemovePoint (): boolean {
    return flipCoin(this.probabilities.removePoint)
  }

  doAddChromosome (): boolean {
    return flipCoin(this.probabilities.addChromosome)
  }

  doRemoveChromosome (): boolean {
    return flipCoin(this.probabilities.removeChromosome)
  }

  doResetChromosome (): boolean {
    return flipCoin(this.probabilities.resetChromosome)
  }

  doPermute (): boolean {
    return flipCoin(this.probabilities.permuteChromosomes)
  }

  colorNudge (): number {
    return this.colorDist.next()
  }

  pointNudge (): number {
    return this.pointDist.next()
  }

  permutationNudge (index: number): number[] {
    const dist = Math.round(this.permuteDist.next() * this.genomeSize)
    const start = dist > 0 ? index : Math.max(0, index + dist)
    const end = dist > 0 ? Math.min(this.genomeSize - 1, index + dist) : index

    return [start, end]
  }

  serialize (): Mutation {
    return {
      genomeSize: this.genomeSize,
      isSinglePoint: this.isSinglePoint,
      distributions: this.distributions,
      probabilities: this.probabilities
    }
  }
}

export default MutationModel
