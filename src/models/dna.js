/* eslint-disable no-param-reassign */
import {
  flipCoin, genNumRange, randomInt, tweakAlpha, tweakPoint, tweakColor,
} from './utils';

const randomColor = () => [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), Math.random()];

const randomPoint = () => [Math.random(), Math.random()];

class DNA {
  static swap(type, dna1, dna2, index) {
    const temp = dna1[type][index];
    dna1[type][index] = dna2[type][index];
    dna2[type][index] = temp;
  }

  static swapPoint(dna1, dna2, index) {
    DNA.swap('points', dna1, dna2, index);
  }

  static swapColor(dna1, dna2, index) {
    DNA.swap('color', dna1, dna2, index);
  }

  static crossover(type, dna1, dna2, point) {
    const { length } = dna1[type];
    const values = dna1[type].splice(point, length, ...dna2[type].slice(point, length));
    dna2[type].splice(point, length, ...values);
  }

  static crossoverPoint(dna1, dna2, point) {
    DNA.crossover('points', dna1, dna2, point);
  }

  static crossoverColor(dna1, dna2, point) {
    DNA.crossover('color', dna1, dna2, point);
  }

  static onePointCrossover(dna1, dna2) {
    const result = [dna1.clone(), dna2.clone()];
    if (flipCoin()) {
      const point = randomInt(0, dna1.points.length);
      DNA.crossoverPoint(...result, point);
    } else {
      const point = randomInt(0, dna1.points.length);
      DNA.crossoverColor(...result, point);
    }
    return result;
  }

  static uniformCrossover(dna1, dna2, prob) {
    const child1 = dna1.clone();
    const child2 = dna2.clone();
    genNumRange(dna1.points.length).forEach((i) => {
      if (flipCoin(prob)) {
        DNA.swapPoint(child1, child2, i);
      }
    });
    genNumRange(dna1.color.length).forEach((i) => {
      if (flipCoin(prob)) {
        DNA.swapColor(child1, child2, i);
      }
    });
    return [child1, child2];
  }

  static mutate(dna, smallRate, largeRate) {
    if (flipCoin(largeRate)) return new DNA();

    if (flipCoin(smallRate)) {
      if (flipCoin(0.5)) {
        dna.mutatePoints(largeRate);
      } else {
        dna.mutateColor(largeRate);
      }
    }
    return dna;
  }

  static deserialize({ points, color }) {
    const data = points.split(',').map((p) => parseFloat(p));
    // console.log(data);
    const xy = [];
    let i = 0;
    while (i < data.length) {
      xy.push([data[i], data[i + 1]]);
      i += 2;
    }
    return new DNA(
      xy,
      color.split(',').map((p) => parseFloat(p)),
    );
  }

  constructor(points, color) {
    this.points = points || [randomPoint(), randomPoint(), randomPoint()];
    this.color = color || randomColor();
  }

  mutateColor(largeMutationRate) {
    if (flipCoin(largeMutationRate)) {
      this.color = randomColor();
    } else {
      this.color[0] = tweakColor(this.color[0]);
      this.color[1] = tweakColor(this.color[1]);
      this.color[2] = tweakColor(this.color[2]);
      this.color[3] = tweakAlpha(this.color[3]);
    }
  }

  mutatePoints(largeMutationRate) {
    if (flipCoin(largeMutationRate)) {
      this.points = [randomPoint(), randomPoint(), randomPoint()];
    } else {
      this.points[0] = tweakPoint(...this.points[0]);
      this.points[1] = tweakPoint(...this.points[1]);
      this.points[2] = tweakPoint(...this.points[2]);
    }
  }

  createNode() {
    return {
      points: this.points.toString(),
      color: this.color.toString(),
    };
  }

  clone() {
    return new DNA(this.points.slice(), this.color.slice());
  }
}

export default DNA;
