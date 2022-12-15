/* eslint-disable no-param-reassign */
import { clamp } from 'lodash';
import { maxColorValue } from '../constants';
import {
  randomInt,
  rand,
  randomIndex,
  // randomIndex,
} from '../globals/statsUtils';
import { genRange } from '../globals/utils';

const defaultNumSides = 3;

const maxNumSides = 10;

// DNA Initialization Helpers
// ------------------------------------------------------------
const randCV = () => randomInt(0, maxColorValue);

const randomColor = () => [randCV(), randCV(), randCV(), rand()];

const randomPoint = () => [rand(), rand()];

const randomPoints = (len) => genRange(len).map(() => randomPoint());
// const randomPoints = (len) => {
//   const pt = randomPoint();
//   return genRange(len).map(() => pt.slice());
// };

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

const addPointMutation = (dna) => {
  if (dna.points.length >= maxNumSides) {
    return;
  }

  const index = randomIndex(dna.points.length - 1);
  const a = dna.points[index];
  const b = dna.points[index + 1];
  const x = (a[0] + b[0]) / 2;
  const y = (a[1] + b[1]) / 2;
  dna.points.splice(index + 1, 0, [x, y]);
};

const removePointMutation = (dna) => {
  if (dna.points.length < defaultNumSides) {
    return;
  }
  const index = randomIndex(dna.points.length - 1);
  dna.points.splice(index, 1);
};

// Mutate all color values
// const mutateColors = (color, mutation) => {
//   const func = (i) => (i < 3 ? tweakColor : tweakAlpha);
//   return color.map((c, i) => func(i)(mutation, c));
// };

// Mutate just one color value
const mutateColor = (color, index, mutation) => {
  if (index === 3) color[index] = tweakAlpha(mutation, color[index]);
  else color[index] = tweakColor(mutation, color[index]);

  return color;
};

// Mutate all points
const mutatePoints = (points, mutation) => points.map((p) => tweakPoint(mutation, ...p));

// Mutate just one point
const mutatePoint = (points, index, mutation) => {
  points[index] = tweakPoint(mutation, ...points[index]);
  return points;
};

/**
 * DNA
 */
const DNA = {
  create: ({ color: col, points: pts, numSides = defaultNumSides } = {}) => ({
    points: pts || randomPoints(numSides),
    color: col || randomColor(),
  }),

  // mutate: (dna, mutation) => (DNA.create({
  //   color: mutateColors(dna.color, mutation),
  //   points: mutatePoints(dna.points, mutation),
  // })),

  // mutate: (dna, mutation) => {
  //   dna.color = dna.color.map((v, i) => (
  //     mutation.doMutate() ? mutateColor(v, i, mutation) : v
  //   ));
  //   dna.points = dna.points.map((p, i) => (
  //     mutation.doMutate() ? mutatePoint(p, i, mutation) : p
  //   ));
  // },

  mutate: (dna, mutation) => {
    const { color, points } = dna;
    const index = randomIndex(color.length + points.length);
    if (index < color.length) {
      dna.color = mutateColor(color, index, mutation);
    } else {
      dna.points = mutatePoint(points, index - color.length, mutation);
    }
    if (mutation.doAddPoint()) {
      addPointMutation(dna);
    }
    if (mutation.doRemovePoint()) {
      removePointMutation(dna);
    }
    return dna;
  },

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
