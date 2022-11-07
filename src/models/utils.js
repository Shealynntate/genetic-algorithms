import _ from 'lodash';
import { canvasParameters, treeParameters } from '../constants';
// This file contains useful helper functions and constants used in the algorithm

export const codeToChar = (i) => String.fromCharCode(i);

export const charToCode = (v) => v.charCodeAt(0);

export const genNumRange = (max) => ([...Array(max).keys()]);

/**
 * A helper function to generate a range of letters for an Organism's DNA
 * @param {*} start - the starting character of the range
 * @param {*} length - how many characters to include in the range
 * @returns an array of characters, of size length beginning with start. Order is determined by
 * the Unicode standard
 */
export const genCharRange = (start, length) => (
  [...Array(length)].map((_v, i) => codeToChar(charToCode(start) + i))
);

// The domain of DNA values consists of A-Z, a-z, and the space character
export const DNA = [...genCharRange('a', 26), ...genCharRange('A', 26), ' '];

/**
 * Generates a random index into an array of the specified length
 * @param {*} length - The length of the array
 * @returns An index value between [0, length)
 */
export const randomIndex = (length) => (Math.trunc(Math.random() * length));

export const flipCoin = (bias = 0.5) => (Math.random() <= bias);

export const randomInt = (start, end) => (Math.round(Math.random() * (end - start)) + start);

/**
 * Generate an array of characters randomly sampled from the domain of valid DNA to be used as the
 * genome for an Organism in a Population
 * @param {*} length - the number of DNA entries in the genome
 * @returns an array of characters of the specified length
 */
export const createRandomGenome = (length) => (
  [...Array(length)].map(() => DNA[randomIndex(DNA.length)])
);

export const randomDNA = () => DNA[randomIndex(DNA.length)];

export class LoadedDie {
  constructor(sides) {
    this.sides = sides;
    this.u = [];
    this.k = [];
  }

  // ------------------------------------------------------------
  load(probabilities) {
    const uFull = [];

    for (let i = 0; i < this.sides; ++i) {
      this.u[i] = this.sides * probabilities[i];
      if (this.u[i] === 1) {
        this.k[i] = i;
        uFull[i] = true;
      }
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let over = -1;
      let under = -1;
      // Find an entry > 1 and an entry < 1
      for (let i = 0; i < this.sides; ++i) {
        if (this.u[i] < 1 && under < 0 && !uFull[i]) {
          under = i;
        }
        if (this.u[i] > 1 && over < 0 && !uFull[i]) {
          over = i;
        }
      }
      // Theoretically an error, but can occur due to floating point rounding
      if ((over >= 0 && under < 0) || (over < 0 && under >= 0)) {
        if (over >= 0) {
          this.u[over] = 1;
        } else {
          this.u[under] = 1;
        }
        // eslint-disable-next-line no-continue
        continue;
      } else if (over < 0 && under < 0) {
        // Finished filling out the tables
        break;
      }

      this.u[over] -= 1 - this.u[under];
      this.k[under] = over;
      uFull[under] = true;
    }
  }

  roll() {
    const x = Math.random();
    const index = Math.trunc(this.sides * x);
    const y = this.sides * x - index;

    if (y < this.u[index]) {
      return index;
    }
    return this.k[index];
  }
}

export const maxFitOrganism = (orgs) => _.maxBy(orgs, 'fitness');

export const maxFitness = (orgs) => maxFitOrganism(orgs)?.fitness || 0;

export const meanFitness = (orgs) => _.meanBy(orgs, 'fitness');

export const minFitness = (orgs) => _.minBy(orgs, 'fitness')?.fitness || 0;

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

export const createImage = (path, callback) => {
  const image = new Image();
  image.onload = () => { callback(image); };
  image.src = path;

  return image;
};

const { width, height } = canvasParameters;

export const generateTestImage = (image) => {
  const canvas = document.createElement('canvas', { width, height });

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
};
