import { randomNormal } from 'd3';

/**
 *
 */
class RandomNoise {
  constructor(sigma) {
    this.setSigma(sigma);
  }

  next() {
    return this.noise();
  }

  setSigma(sigma) {
    this.noise = randomNormal(0, sigma);
  }
}

export default RandomNoise;
