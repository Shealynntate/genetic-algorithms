/* eslint-disable no-param-reassign */
import { clamp } from 'lodash';
import { maxColorValue } from '../constants';
import { flipCoin, randomInt, rand } from '../globals/statsUtils';
import { genRange } from '../globals/utils';

// DNA Initialization Helpers
// ------------------------------------------------------------
const randCV = () => randomInt(0, maxColorValue);

const randomColor = () => [randCV(), randCV(), randCV(), rand()];

const randomPoint = () => [rand(), rand()];

const randomPoints = () => [randomPoint(), randomPoint(), randomPoint()];

// DNA Crossover Helpers
// ------------------------------------------------------------
const swap = (type, dna1, dna2, index) => {
  const temp = dna1[type][index];
  dna1[type][index] = dna2[type][index];
  dna2[type][index] = temp;
};

const swapPoint = (dna1, dna2, index) => {
  swap('points', dna1, dna2, index);
};

const swapColor = (dna1, dna2, index) => {
  swap('color', dna1, dna2, index);
};

const crossover = (type, dna1, dna2, point) => {
  const { length } = dna1[type];
  const values = dna1[type].splice(point, length, ...dna2[type].slice(point, length));
  dna2[type].splice(point, length, ...values);
};

const crossoverPoint = (dna1, dna2, point) => {
  crossover('points', dna1, dna2, point);
};

const crossoverColor = (dna1, dna2, point) => {
  crossover('color', dna1, dna2, point);
};

// DNA Mutation Helpers
// ------------------------------------------------------------
const tweakPoint = (m, x, y) => [clamp(x + m.pointNudge(), 0, 1), clamp(y + m.pointNudge(), 0, 1)];

const tweakColor = (m, value) => clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue);

const tweakAlpha = (m, value) => clamp(value + m.colorNudge(), 0, 1);

const mutateColor = (color, mutation) => {
  const func = (i) => (i < 3 ? tweakColor : tweakAlpha);
  return color.map((c, i) => func(i)(mutation, c));
};

const mutatePoints = (points, mutation) => points.map((p) => tweakPoint(mutation, ...p));

/**
 * DNA
 */
const DNA = {
  create: ({ color: col, points: pts } = {}) => ({
    points: pts || randomPoints(),
    color: col || randomColor(),
  }),

  onePointCrossover: (dna1, dna2) => {
    const result = [dna1.clone(), dna2.clone()];
    if (flipCoin()) {
      const point = randomInt(0, dna1.points.length);
      crossoverPoint(...result, point);
    } else {
      const point = randomInt(0, dna1.points.length);
      crossoverColor(...result, point);
    }
    return result;
  },

  uniformCrossover: (dna1, dna2, prob) => {
    const child1 = dna1.clone();
    const child2 = dna2.clone();
    genRange(dna1.points.length).forEach((i) => {
      if (flipCoin(prob)) {
        swapPoint(child1, child2, i);
      }
    });
    genRange(dna1.color.length).forEach((i) => {
      if (flipCoin(prob)) {
        swapColor(child1, child2, i);
      }
    });
    return [child1, child2];
  },

  mutate: (dna, mutation) => (DNA.create({
    color: mutateColor(dna.color, mutation),
    points: mutatePoints(dna.points, mutation),
  })),

  clone: (dna) => DNA.create({ points: dna.points.slice(), color: dna.color.slice() }),
};

export const Test = {
  randCV,
  randomColor,
  randomPoint,
  randomPoints,
  swap,
  swapPoint,
  swapColor,
  crossover,
  crossoverPoint,
  crossoverColor,
  tweakPoint,
  tweakColor,
  tweakAlpha,
  mutateColor,
  mutatePoints,
};

export default DNA;
