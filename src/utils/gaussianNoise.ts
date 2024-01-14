import { randomNormal } from 'd3'
import { setSigFigs } from './utils'

const sigFigs = 5

/**
 *
 */
class GaussianNoise {
  baseSigma: number
  sigma: number
  noise: () => number

  constructor (sigma: number) {
    this.baseSigma = sigma
    this.sigma = sigma
    this.noise = randomNormal(0, sigma)
  }

  next (): number {
    return setSigFigs(this.noise(), sigFigs)
  }

  getSigma (): number {
    return this.sigma
  }

  setSigma (sigma: number): void {
    this.noise = randomNormal(0, sigma)
  }
}

export default GaussianNoise
