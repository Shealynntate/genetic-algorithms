import { randomNormal } from 'd3';
import { setSigFigs } from './utils.ts';

const sigFigs = 5;

/**
 *
 */
class GaussianNoise {
  constructor(sigma) {
    this.baseSigma = sigma;
    this.sigma = sigma;
    this.setSigma(sigma);
  }

  next() {
    return setSigFigs(this.noise(), sigFigs);
  }

  getSigma() {
    return this.sigma;
  }

  setSigma(sigma) {
    this.noise = randomNormal(0, sigma);
  }
}

export default GaussianNoise;
