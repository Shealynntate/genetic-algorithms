import { randomNormal } from 'd3';
import { setSigFigs } from './statsUtils';

/**
 *
 */
class RandomNoise {
  constructor(sigma) {
    this.baseSigma = sigma;
    this.sigma = sigma;
    this.disruptFactor = 5;
    this.decayRate = 0.1; // 0.99;
    this.cooldownTime = 500;
    this.cooldownTimer = 0;
    this.inDecay = false;
    this.setSigma(sigma);
  }

  next() {
    return setSigFigs(this.noise(), 4);
  }

  setSigma(sigma) {
    this.noise = randomNormal(0, sigma);
  }

  disrupt() {
    if (this.inDecay) return;
    console.log('DISRUPTION EVENT');
    this.sigma *= this.disruptFactor;
    this.setSigma(this.sigma);
    this.inDecay = true;
  }

  nextGeneration() {
    if (!this.inDecay) return;

    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= 1;
      return;
    }

    if (this.baseSigma === this.sigma) {
      console.log('END OF DISRUPTION EVENT');
      this.inDecay = false;
      return;
    }

    this.sigma = Math.max(this.baseSigma, this.sigma * this.decayRate);
    this.setSigma(this.sigma);
    if (this.baseSigma === this.sigma) {
      this.cooldownTimer = this.cooldownTime;
    }
  }
}

export default RandomNoise;
