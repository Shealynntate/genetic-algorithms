import RandomNoise from '../globals/randomNoise';
import { flipCoin } from '../globals/utils';

class Mutation {
  constructor({ sigma, crossoverProb, permuteProb }) {
    this.noise = new RandomNoise(sigma);
    this.crossoverProb = crossoverProb;
    this.permuteProb = permuteProb;
  }

  doCrossover() {
    return flipCoin(this.crossoverProb);
  }

  doPermute() {
    return flipCoin(this.permuteProb);
  }
}

export default Mutation;
