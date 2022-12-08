/* eslint-disable no-param-reassign */
import { clamp } from 'lodash';
import { maxColorValue } from '../constants';
import { flipCoin, randomInt, setSigFigs } from '../globals/statsUtils';
import { genRange } from '../globals/utils';

const rand = () => setSigFigs(Math.random(), 4);

const randomColorValue = () => randomInt(0, maxColorValue);
const randomColor = () => (
  [randomColorValue(), randomColorValue(), randomColorValue(), rand()]
);
// const randomColor = () => [0, 0, 0, 0];

const randomPoint = () => [rand(), rand()];

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
    genRange(dna1.points.length).forEach((i) => {
      if (flipCoin(prob)) {
        DNA.swapPoint(child1, child2, i);
      }
    });
    genRange(dna1.color.length).forEach((i) => {
      if (flipCoin(prob)) {
        DNA.swapColor(child1, child2, i);
      }
    });
    return [child1, child2];
  }

  static deserialize({ points, color }) {
    const data = points.split(',').map((p) => parseFloat(p));
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

  static tweakPoint(noise, x, y) {
    return [clamp(x + noise.next(), 0, 1), clamp(y + noise.next(), 0, 1)];
  }

  static tweakColor(noise, value) {
    return clamp(value + noise.next() * maxColorValue, 0, maxColorValue);
  }

  static tweakAlpha(noise, value) {
    return clamp(value + noise.next(), 0, 1);
  }

  constructor(points, color) {
    this.points = points || [randomPoint(), randomPoint(), randomPoint()];
    this.color = color || randomColor();
  }

  mutate(noise) {
    this.mutateColor(noise);
    this.mutatePoints(noise);
  }

  mutateColor(noise) {
    this.color = this.color.map((c, i) => (
      i < 3 ? DNA.tweakColor(noise, c) : DNA.tweakAlpha(noise, c)
    ));
  }

  mutatePoints(noise) {
    this.points = this.points.map((p) => DNA.tweakPoint(noise, ...p));
  }

  createNode() {
    const p = this.points;
    const c = this.color;
    // Note: this appears to run much faster than toString() or join()
    return {
      points: `${p[0][0]},${p[0][1]},${p[1][0]},${p[1][1]},${p[2][0]},${p[2][1]}`,
      color: `${c[0]},${c[1]},${c[2]},${c[3]}`,
    };
  }

  clone() {
    return new DNA(this.points.slice(), this.color.slice());
  }
}

export default DNA;
