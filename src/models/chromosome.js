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

const minNumSides = 3;
const maxNumSides = 10;
const defaultNumSides = 3;

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

// Mutate all color values
// eslint-disable-next-line no-unused-vars
const mutateColors = (color, mutation) => {
  const func = (i) => (i < 3 ? tweakColor : tweakAlpha);
  return color.map((c, i) => func(i)(mutation, c));
};

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

  clone: (chromosome) => Chromosome.create({
    points: chromosome.points.slice(), color: chromosome.color.slice(),
  }),

  mitosis: (chromosome) => {
    const half = Math.ceil(chromosome.points.length / 2);
    const a = Chromosome.clone(chromosome);
    const b = Chromosome.clone(chromosome);
    a.points = a.points.slice(0, half);
    b.points = b.points.slice(half);

    return [a, b];
  },

  // totalMutation: (chromosomes, mutation) => (Chromosome.create({
  //   color: mutateColors(chromosomes.color, mutation),
  //   points: mutatePoints(chromosomes.points, mutation),
  // })),

  multiMutation: (chromosomes, mutation) => {
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
  singleMutation: (chromosome, mutation) => {
    const { color, points } = chromosome;
    const index = randomIndex(color.length + points.length);
    if (index < color.length) {
      chromosome.color = mutateColor(color, index, mutation);
      // chromosome.color = mutateColors(color, mutation); // TODO: Temp test
    } else {
      chromosome.points = mutatePoint(points, index - color.length, mutation);
    }

    return chromosome;
  },

  /**
   * Adds a randomly generated (x,y) point to the Chromosome if possible
   * @param {*} chromosomes - an array of Chromosome objects
   * @returns true if the add mutation was successful, false if the chromosome already has the
   * maximum number of points allowed
   */
  addPointMutation: (chromosome) => {
    if (chromosome.points.length >= maxNumSides) {
      return false;
    }

    const index = randomIndex(chromosome.points.length - 1);
    const a = chromosome.points[index];
    const b = chromosome.points[index + 1];
    const x = (a[0] + b[0]) / 2;
    const y = (a[1] + b[1]) / 2;
    chromosome.points.splice(index + 1, 0, [x, y]);

    return true;
  },

  removePointMutation: (chromosome) => {
    if (chromosome.points.length <= minNumSides) {
      return false;
    }
    const index = randomIndex(chromosome.points.length - 1);
    chromosome.points.splice(index, 1);

    return true;
  },

  resetMutation: (chromosome) => {
    chromosome.points = randomPoints(defaultNumSides);
    chromosome.color = randomColor();
  },
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