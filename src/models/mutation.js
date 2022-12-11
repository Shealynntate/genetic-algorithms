import RandomNoise from '../globals/randomNoise';
import { flipCoin } from '../globals/statsUtils';

class Mutation {
  constructor({ colorSigma, pointSigma, permuteProb }) {
    this.colorNoise = new RandomNoise(colorSigma);
    this.pointNoise = new RandomNoise(pointSigma);
    this.permuteProb = permuteProb;
  }

  doPermute() {
    return flipCoin(this.permuteProb);
  }

  colorNudge() {
    return this.colorNoise.next();
  }

  pointNudge() {
    return this.pointNoise.next();
  }
}

export default Mutation;
