import { setSigFigs } from '../common/utils'

// A Collection of math and probability based functions
// --------------------------------------------------

/**
 * Generates a random number between [0, 1) with a set number of sig figs
 * @param {*} num - the number of sig figs (places after the decimal), default is 5
 * @returns the random floating point number
 */
export const rand = (num = 5): number => setSigFigs(Math.random(), num)

/**
 * Generates a random floating point number shifted to be in the specified range
 * @param {*} start - the value the number must be greater than or equal to
 * @param {*} end - the value the number must be less than
 * @returns a random float between [start, end)
 */
export const randomFloat = (start: number, end: number): number => {
  const range = end - start
  return Math.random() * range + start
}

/**
 * Generates a random integer shifted to be in the specified range
 * @param {*} start - the value the number must be greater than or equal to
 * @param {*} end - th evalue the number must be less than or equal to
 * @returns a random integer between [start, end] inclusive
 */
export const randomInt = (start: number, end: number): number => {
  const range = Math.random() * (end - start + 1)
  return Math.round(range + start - 0.5)
}

/**
 * Generates a random index into an array of the specified length
 * @param {*} length - The length of the array
 * @returns An index value between [0, length)
 */
export const randomIndex = (length: number): number =>
  Math.trunc(Math.random() * length)

/**
 * Flips a biased coin and returns true (heads) or false (tails)
 * @param {*} bias - the bias for favoring heads over tails.
 * By default it's set to 0.5, making it a fair coin
 * @returns the result of flipping the coin - true or false
 */
export const flipCoin = (bias = 0.5): boolean => Math.random() <= bias

/**
 * Converts a fractional number to a percentage string
 * @param value the value to convert to a percentage, should be between 0 and 1
 * @param sigFigs the number of significant figures to display
 * @returns a string representation of the percentage
 */
export const toPercent = (value: number, sigFigs = 1): string =>
  `${setSigFigs(value * 100, sigFigs)}%`
