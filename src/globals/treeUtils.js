import _ from 'lodash';
import { treeParameters } from '../constants';

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

export const genNodePropsAreEqual = (prevProps, nextProps) => (
  prevProps.id === nextProps.id && prevProps.isNewestGeneration === nextProps.isNewestGeneration
);

// [0, 100, 200, 300, 400, 600, 800, 1000, 1500, 2000, ...]
// const saveThresholds = [
//   { threshold: 50, mod: 10 },
//   { threshold: 100, mod: 50 },
//   { threshold: 300, mod: 100 },
//   { threshold: 1000, mod: 200 },
//   { threshold: 5000, mod: 500 },
//   { threshold: 10000, mod: 1000 },
//   { threshold: Math.MAX_SAFE_INTEGER, mod: 5000 },
// ];

export const shouldSaveGenImage = (genId) => {
  let mod = 5000;
  if (genId <= 10000) {
    mod = 1000;
  }
  if (genId <= 5000) {
    mod = 500;
  }
  if (genId <= 1000) {
    mod = 200;
  }
  if (genId <= 300) {
    mod = 100;
  }
  if (genId <= 100) {
    mod = 50;
  }
  if (genId <= 60) {
    mod = 20;
  }
  return (genId % mod) === 0;
};
