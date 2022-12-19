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

const maxNumSides = 8;

// Chromosome Initialization Helpers
// ------------------------------------------------------------
const randCV = () => randomInt(0, maxColorValue);

const randomColor = () => [randCV(), randCV(), randCV(), rand()];

const randomPoint = () => [rand(), rand()];

const randomPoints = (len) => genRange(len).map(() => randomPoint());
// const randomPoints = (len) => {
//   const pt = randomPoint();
//   return genRange(len).map(() => pt.slice());
// };

// Chromosome Crossover Helpers
// ------------------------------------------------------------
const swap = (type, chromosomes1, chromosomes2, index) => {
  const temp = chromosomes1[type][index];
  chromosomes1[type][index] = chromosomes2[type][index];
  chromosomes2[type][index] = temp;
};

const swapPoint = (chromosomes1, chromosomes2, index) => {
  swap('points', chromosomes1, chromosomes2, index);
};

const swapColor = (chromosomes1, chromosomes2, index) => {
  swap('color', chromosomes1, chromosomes2, index);
};

const crossover = (type, chrome1, chrome2, point) => {
  const { length } = chrome1[type];
  const values = chrome1[type].splice(point, length, ...chrome2[type].slice(point, length));
  chrome2[type].splice(point, length, ...values);
};

const crossoverPoint = (chromosomes1, chromosomes2, point) => {
  crossover('points', chromosomes1, chromosomes2, point);
};

const crossoverColor = (chromosomes1, chromosomes2, point) => {
  crossover('color', chromosomes1, chromosomes2, point);
};

// Chromosome Mutation Helpers
// ------------------------------------------------------------
const tweakPoint = (m, x, y) => [clamp(x + m.pointNudge(), 0, 1), clamp(y + m.pointNudge(), 0, 1)];

const tweakColor = (m, value) => clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue);

const tweakAlpha = (m, value) => clamp(value + m.colorNudge(), 0, 1);

const addPointMutation = (chromosomes) => {
  if (chromosomes.points.length >= maxNumSides) {
    return;
  }

  const index = randomIndex(chromosomes.points.length - 1);
  const a = chromosomes.points[index];
  const b = chromosomes.points[index + 1];
  const x = (a[0] + b[0]) / 2;
  const y = (a[1] + b[1]) / 2;
  chromosomes.points.splice(index + 1, 0, [x, y]);
};

const removePointMutation = (chromosomes) => {
  if (chromosomes.points.length <= defaultNumSides) {
    return;
  }
  const index = randomIndex(chromosomes.points.length - 1);
  chromosomes.points.splice(index, 1);
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
// eslint-disable-next-line no-unused-vars
const mutatePoint = (points, index, mutation) => {
  points[index] = tweakPoint(mutation, ...points[index]);
  return points;
};

/**
 * Chromosome
 */
const Chromosome = {
  create: ({ color: col, points: pts, numSides = defaultNumSides } = {}) => ({
    points: pts || randomPoints(numSides),
    color: col || randomColor(),
  }),

  // mutate: (chromosomes, mutation) => (Chromosome.create({
  //   color: mutateColors(chromosomes.color, mutation),
  //   points: mutatePoints(chromosomes.points, mutation),
  // })),

  mutate: (chromosomes, mutation) => {
    if (mutation.doResetChromosome()) {
      chromosomes.points = randomPoints(defaultNumSides);
      chromosomes.color = randomColor();
      return chromosomes;
    }

    if (mutation.doAddPoint()) {
      addPointMutation(chromosomes);
    }
    if (mutation.doRemovePoint()) {
      removePointMutation(chromosomes);
    }

    for (let i = 0; i < chromosomes.color.length; ++i) {
      if (mutation.doMutate()) {
        if (i === 3) {
          chromosomes.color[i] = tweakAlpha(mutation, chromosomes.color[i]);
        } else {
          chromosomes.color[i] = tweakColor(mutation, chromosomes.color[i]);
        }
      }
    }
    for (let i = 0; i < chromosomes.points.length; ++i) {
      if (mutation.doMutate()) {
        chromosomes.points[i] = tweakPoint(mutation, ...chromosomes.points[i]);
      }
    }
    return chromosomes;
  },

  // Exacly 1 mutation per Chromosome
  // mutate: (chromosomes, mutation) => {
  //   const { color, points } = chromosomes;
  //   const index = randomIndex(color.length + points.length);
  //   if (index < color.length) {
  //     chromosomes.color = mutateColor(color, index, mutation);
  //   } else {
  //     chromosomes.points = mutatePoint(points, index - color.length, mutation);
  //   }
  //   if (mutation.doAddPoint()) {
  //     addPointMutation(chromosomes);
  //   }
  //   if (mutation.doRemovePoint()) {
  //     removePointMutation(chromosomes);
  //   }
  //   return chromosomes;
  // },

  clone: (chromosomes) => Chromosome.create({
    points: chromosomes.points.slice(), color: chromosomes.color.slice(),
  }),
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

export default Chromosome;
