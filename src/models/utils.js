// This file contains useful helper functions and constants used in the algorithm

const codeToChar = (i) => String.fromCharCode(i);

const charToCode = (v) => v.charCodeAt(0);

const genCharRange = (start, length) => (
  [...Array(length)].map((_, i) => codeToChar(charToCode(start) + i))
);

// The domain of DNA values consists of A-Z, a-z, and the space character
export const DNA = [...genCharRange('a', 26), ...genCharRange('A', 26), ' '];

export const randomIndex = (size) => (Math.trunc(Math.random() * size));

export const createRandomGenome = (size) => (
  [...Array(size)].map(() => DNA[randomIndex(DNA.length)])
);
