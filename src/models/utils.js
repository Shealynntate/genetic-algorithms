// This file contains useful helper functions and constants used in the algorithm

export const codeToChar = (i) => String.fromCharCode(i);

export const charToCode = (v) => v.charCodeAt(0);

/**
 * A helper function to generate a range of letters for an Organism's DNA
 * @param {*} start - the starting character of the range
 * @param {*} length - how many characters to include in the range
 * @returns an array of characters, of size length beginning with start. Order is determined by
 * the Unicode standard
 */
export const genCharRange = (start, length) => (
  [...Array(length)].map((_, i) => codeToChar(charToCode(start) + i))
);

// The domain of DNA values consists of A-Z, a-z, and the space character
export const DNA = [...genCharRange('a', 26), ...genCharRange('A', 26), ' '];

/**
 * Generates a random index into an array of the specified length
 * @param {*} length - The length of the array
 * @returns An index value between [0, length)
 */
export const randomIndex = (length) => (Math.trunc(Math.random() * length));

/**
 * Generate an array of characters randomly sampled from the domain of valid DNA to be used as the
 * genome for an Organism in a Population
 * @param {*} length - the number of DNA entries in the genome
 * @returns an array of characters of the specified length
 */
export const createRandomGenome = (length) => (
  [...Array(length)].map(() => DNA[randomIndex(DNA.length)])
);
