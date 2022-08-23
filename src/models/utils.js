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

export const flipCoin = (bias = 0.5) => (Math.random() <= bias);

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
