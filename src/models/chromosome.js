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

// Chromosome Initialization Helpers
// ------------------------------------------------------------
const randCV = () => randomInt(0, maxColorValue);

const randomColor = () => [randCV(), randCV(), randCV(), rand()];

const transparent = () => [randCV(), randCV(), randCV(), 0];

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

// const tweakColor = (m, value) => clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue);
const mv = maxColorValue;
const tweakColor = (m, value) => ((mv + value + m.colorNudge() * mv) % mv);

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
  create: ({ color: col, points: pts, numSides } = {}) => ({
    points: pts || randomPoints(numSides),
    color: col || transparent(),
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

  tweakMutationUniform: (chromosome, mutation) => {
    for (let i = 0; i < chromosome.color.length; ++i) {
      if (mutation.doTweakColor()) {
        if (i === 3) {
          chromosome.color[i] = tweakAlpha(mutation, chromosome.color[i]);
        } else {
          chromosome.color[i] = tweakColor(mutation, chromosome.color[i]);
        }
      }
    }
    for (let i = 0; i < chromosome.points.length; ++i) {
      if (mutation.doTweakPoint()) {
        chromosome.points[i] = tweakPoint(mutation, ...chromosome.points[i]);
      }
    }
    return chromosome;
  },

  // Exacly 1 mutation per Chromosome
  tweakMutationSinglePoint: (chromosome, mutation) => {
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
  addPointMutation: (chromosome, maxNumPoints) => {
    if (chromosome.points.length >= maxNumPoints) {
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

  removePointMutation: (chromosome, minNumPoints) => {
    if (chromosome.points.length <= minNumPoints) {
      return false;
    }
    const index = randomIndex(chromosome.points.length - 1);
    chromosome.points.splice(index, 1);

    return true;
  },

  resetMutation: (chromosome, numPoints) => {
    chromosome.points = randomPoints(numPoints);
    chromosome.color = transparent();
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
