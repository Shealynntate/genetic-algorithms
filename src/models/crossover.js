import { flipCoin } from '../globals/statsUtils';

//
class Crossover {
  constructor(data) {
    this.initialize(data);
  }

  initialize({ type, probMap }) {
    this.type = type;
    this.probMap = probMap;
    this.prevMaxFitness = -1;
    this.markNextGen({ maxFitness: 0 });
  }

  serialize() {
    return {
      type: this.type,
      probMap: this.probMap,
    };
  }

  deserialize(data) {
    this.initialize(data);
  }

  markNextGen({ maxFitness }) {
    this.probMap.forEach(({ threshold, values }) => {
      if (this.prevMaxFitness < threshold && maxFitness >= threshold) {
        Object.keys(values).forEach((prob) => {
          this[prob] = values[prob];
        });
      }
    });
    this.prevMaxFitness = maxFitness;
  }

  doCrossover() {
    return flipCoin(this.prob);
  }
}

export default Crossover;
