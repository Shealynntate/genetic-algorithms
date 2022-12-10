import _ from 'lodash';

/**
 * Sets the number of significant figures for an input number
 * @param {*} value a floating point number
 * @param {*} sigFigs the number of digits after the decimal point you want to preserve
 * @returns the new value with the appropriate number of significant figures
 */
export const setSigFigs = (value, sigFigs) => {
  const m = 10 ** sigFigs;
  return Math.round(value * m) / m;
};

/**
 * Compares two floating point numbers up to the thousandths place
 * @param {*} a - a floating point number to compare
 * @param {*} b - a floating point number to compare
 * @returns true if the values are approximately equal and false otherwise
 */
export const approxEqual = (a, b) => (setSigFigs(a, 3) === setSigFigs(b, 3));

export const rand = (num = 4) => setSigFigs(Math.random(), num);

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
