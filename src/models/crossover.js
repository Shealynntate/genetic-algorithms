import { flipCoin } from '../globals/statsUtils';

//
class Crossover {
  constructor({ type, prob }) {
    this.type = type;
    this.prob = prob;
  }

  doCrossover() {
    return flipCoin(this.prob);
  }
}

export default Crossover;
