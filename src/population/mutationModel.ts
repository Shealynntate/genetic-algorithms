import {
  type MutationProbabilityParameters,
  type MutationParameters,
  type Mutation,
  type DistributionMap,
  type MutationProbabilities
} from './types'
import GaussianNoise from '../utils/gaussianNoise'
import { computeProb, flipCoin } from '../utils/statsUtils'
import { objectKeys } from '../utils/utils'

/**
 * Mutation
 */
class MutationModel {
  colorDist: GaussianNoise
  pointDist: GaussianNoise
  permuteDist: GaussianNoise
  probabilityParameters: MutationProbabilityParameters
  probabilities: MutationProbabilities
  distributions: DistributionMap
  genomeSize: number
  isSinglePoint: boolean

  constructor (parameters: MutationParameters) {
    const { distributionSigma } = parameters
    this.probabilityParameters = parameters.probabilityParameters
    this.distributions = distributionSigma
    this.colorDist = new GaussianNoise(distributionSigma.colorSigma)
    this.pointDist = new GaussianNoise(distributionSigma.pointSigma)
    this.permuteDist = new GaussianNoise(distributionSigma.permuteSigma)
    this.genomeSize = parameters.genomeSize
    this.isSinglePoint = parameters.isSinglePoint
    this.probabilities = this.computeProbabilities(0)
  }

  computeProbabilities (maxFitness: number): MutationProbabilities {
    const probabilities: any = {}
    objectKeys(this.probabilityParameters).forEach((type) => {
      probabilities[type] = computeProb(this.probabilityParameters[type], maxFitness)
    })

    return probabilities as MutationProbabilities
  }

  markNextGen (maxFitness: number): void {
    // Recompute probabilities
    this.probabilities = this.computeProbabilities(maxFitness)
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
      isSinglePoint: this.isSinglePoint,
      distributions: this.distributions,
      probabilityParameters: this.probabilityParameters,
      probabilities: this.probabilities
    }
  }
}

export default MutationModel
