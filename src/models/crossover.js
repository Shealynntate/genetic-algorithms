import { flipCoin } from '../globals/statsUtils';

//
class Crossover {
  constructor(data) {
    this.initialize(data);
  }

  initialize({ type, prob }) {
    this.type = type;
    this.prob = prob;
  }

  serialize() {
    return {
      type: this.type,
      prob: this.prob,
    };
  }

  deserialize(data) {
    this.initialize(data);
  }

  markNextGen({ genId, maxFitness }) {
    if (maxFitness >= 0.965) {
      this.prob *= 1;
    }
    if (genId > 100_000) {
      this.prob = 0.0001; // TODO: placeholder
    // Upodate Mutation Rate
    // const prob = 0.03;
    // if (gen.genId > 2_000) prob = 0.01;
    // if (gen.genId > 4_000) prob = 0.01;
    }
  }

  doCrossover() {
    return flipCoin(this.prob);
  }

  setProbability(value) {
    this.prob = value;
  }
}

export default Crossover;
