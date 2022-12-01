import _ from 'lodash';
import { canvasParameters, treeParameters } from '../constants';
// This file contains useful helper functions and constants used in the algorithm

export const genRange = (max) => ([...Array(max).keys()]);

export const genMinMaxRange = (min, max) => ([...Array(max).keys()].slice(min));

export const approxEqual = (a, b) => (Math.round(1000 * a) === Math.round(1000 * b));

/**
 * Generates a random index into an array of the specified length
 * @param {*} length - The length of the array
 * @returns An index value between [0, length)
 */
export const randomIndex = (length) => (Math.trunc(Math.random() * length));

export const flipCoin = (bias = 0.5) => (Math.random() <= bias);

export const randomFloat = (start, end) => (Math.random() * (end - start)) + start;

export const randomInt = (start, end) => (Math.round(Math.random() * (end - start)) + start);

export const maxFitOrganism = (orgs) => _.maxBy(orgs, 'fitness');

export const maxFitness = (orgs) => maxFitOrganism(orgs)?.fitness || 0;

export const meanFitness = (orgs) => _.meanBy(orgs, 'fitness');

export const minFitness = (orgs) => _.minBy(orgs, 'fitness')?.fitness || 0;

export const fitnessBounds = (orgs) => {
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  let total = 0;
  orgs.forEach(({ fitness }) => {
    if (fitness < min) min = fitness;
    if (fitness > max) max = fitness;
    total += fitness;
  });

  return [min, total / orgs.length, max];
};

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
export const hsv2rgb = (h, s, v) => {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
};

const toHex = (c) => Math.trunc(c * 255).toString(16);

export const rgb2Hex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

export const hsvtoHex = (h, s, v) => {
  const rgb = hsv2rgb(h, s, v);
  return rgb2Hex(...rgb);
};

export const genNodePropsAreEqual = (prevProps, nextProps) => (
  prevProps.id === nextProps.id && prevProps.isNewestGeneration === nextProps.isNewestGeneration
);

const {
  columns,
  padding,
  spacing,
  genHeight,
} = treeParameters;

export const nodeIndexToX = (index) => (index % columns) * spacing + padding;

export const nodeIndexToY = (index) => Math.trunc(index / columns) * spacing + padding;

export const xyToNodeIndex = (x, y, length) => {
  const xInv = (Math.max(x - padding, 0) / spacing);
  const yInv = (Math.max(y - padding, 0) / spacing);
  const index = Math.round(xInv) + Math.round(yInv);

  return (index < length) ? index : -1;
};

const organismIndex = (id, organisms) => (organisms.findIndex((o) => o.id === id));

const organismById = (id, organisms) => {
  const organism = organisms?.find((o) => o.id === id);
  if (!organism) return null;
  // Only return the parent's position to avoid overhead of recursive parent pointers
  return _.pick(organism, ['x', 'y', 'id', 'genome', 'fitness']);
};

export const generateTree = (generations) => {
  let prevGen = [];
  return generations.map((gen, genIndex) => {
    const nextGen = generations[genIndex + 1]?.organisms || [];
    const currentGen = gen.organisms.map((organism, index) => ({
      ...organism,
      x: nodeIndexToX(index),
      y: nodeIndexToY(index),
      parentA: organismById(organism.parentA, prevGen),
      parentB: organismById(organism.parentB, prevGen),
      children: organism.children.map((id, childIndex) => ({
        ...organismById(id, nextGen),
        x: nodeIndexToX(organismIndex(id, nextGen)),
        y: nodeIndexToY(organismIndex(id, nextGen)) + genHeight,
        index: childIndex,
      })),
    }));

    prevGen = currentGen;
    return {
      id: gen.id,
      x: genIndex,
      meanFitness: gen.meanFitness,
      maxFitness: gen.maxFitness,
      minFitness: gen.minFitness,
      deviation: gen.deviation,
      organisms: currentGen,
    };
  });
};

export const generateTreeLayer = (generations, genIndex) => {
  const len = generations.length;
  const prevGen = genIndex > 0 ? generations[genIndex - 1].organisms : [];
  const nextGen = genIndex < len - 1 ? generations[len - 1].organisms : [];
  const gen = generations[genIndex];
  const currentGen = gen.organisms.map((organism, i) => ({
    ...organism,
    x: nodeIndexToX(i),
    y: nodeIndexToY(i),
    parentA: organismById(organism.parentA, prevGen),
    parentB: organismById(organism.parentB, prevGen),
    children: organism.children.map((id, childIndex) => ({
      ...organismById(id, nextGen),
      x: nodeIndexToX(organismIndex(id, nextGen)),
      y: nodeIndexToY(organismIndex(id, nextGen)) + genHeight,
      index: childIndex,
    })),
  }));

  return {
    id: gen.id,
    x: gen.id,
    meanFitness: gen.meanFitness,
    maxFitness: gen.maxFitness,
    minFitness: gen.minFitness,
    deviation: gen.deviation,
    organisms: currentGen,
    maxFitOrganism: gen.maxFitOrganism,
  };
};

const { width, height } = canvasParameters;

export const createImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = (error) => reject(error);
  image.src = src;
});

export const createImageData = async (src) => {
  const image = await createImage(src);

  const canvas = document.createElement('canvas', { width, height });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  return ctx.getImageData(0, 0, width, height);
};

export const fileToBase64 = async (file) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => { resolve(reader.result); };
    reader.onerror = (error) => { reject(error); };
  });
  reader.readAsDataURL(file);

  return promise;
};

// [0, 100, 200, 300, 400, 600, 800, 1000, 1500, 2000, ...]
export const shouldSaveGenImage = (genId) => {
  let mod = 500;
  if (genId <= 1000) {
    mod = 200;
  }
  if (genId <= 300) {
    mod = 100;
  }
  return (genId % mod) === 0;
};
