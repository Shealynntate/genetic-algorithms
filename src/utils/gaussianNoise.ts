import { randomNormal } from 'd3'

import { setSigFigs } from '../common/utils'
import { random } from './random'

const sigFigs = 5

/**
 *
 */
class GaussianNoise {
  baseSigma: number
  sigma: number
  noise: () => number

  constructor(mean: number, sigma: number) {
    this.baseSigma = sigma
    this.sigma = sigma
    this.noise = randomNormal.source(random)(mean, sigma)
  }

  next(): number {
    return setSigFigs(this.noise(), sigFigs)
  }

  getSigma(): number {
    return this.sigma
  }

  setSigma(sigma: number): void {
    this.noise = randomNormal.source(random)(0, sigma)
  }
}

export default GaussianNoise
