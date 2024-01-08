/* eslint-disable no-param-reassign */
import { clamp } from 'lodash';
import { maxColorValue } from '../constants/constants';
import { randomInt, rand } from '../utils/statsUtils';
import { genRange } from '../utils/utils.ts';

// Chromosome Initialization Helpers
// ------------------------------------------------------------
export const randCV = () => randomInt(0, maxColorValue);

export const randomColor = () => [randCV(), randCV(), randCV(), rand()];

export const transparent = () => [randCV(), randCV(), randCV(), 0];

export const randomPoint = () => [rand(), rand()];

export const randomPoints = (len) => genRange(len).map(() => randomPoint());

// Chromosome Mutation Helpers
// ------------------------------------------------------------
export const tweakPoint = (m, x, y) => (
  [clamp(x + m.pointNudge(), 0, 1), clamp(y + m.pointNudge(), 0, 1)]
);

export const tweakColor = (m, value) => (
  clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue)
);

export const tweakAlpha = (m, value) => clamp(value + m.colorNudge(), 0, 1);

// Mutate a single color value
export const mutateColor = (color, index, mutation) => {
  if (index === 3) color[index] = tweakAlpha(mutation, color[index]);
  else color[index] = tweakColor(mutation, color[index]);

  return color;
};

// Mutate a single (x, y) point
export const mutatePoint = (points, index, mutation) => {
  points[index] = tweakPoint(mutation, ...points[index]);
  return points;
};
