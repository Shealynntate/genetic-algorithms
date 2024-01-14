import { type ProbabilityParameters } from '../population/types.js'
import { setSigFigs } from './utils'

// A Collection of math and probability based functions
// --------------------------------------------------

/**
 * Generates a random number between [0, 1) with a set number of sig figs
 * @param {*} num - the number of sig figs (places after the decimal), default is 5
 * @returns the random floating point number
 */
export const rand = (num: number = 5): number => setSigFigs(Math.random(), num)

/**
 * Generates a random floating point number shifted to be in the specified range
 * @param {*} start - the value the number must be greater than or equal to
 * @param {*} end - the value the number must be less than or equal to
 * @returns a random float between [start, end] inclusive
 */
export const randomFloat = (start: number, end: number): number => {
  const range = Math.random() * (end - start + 1)
  const result = range + start - 0.5
  return Math.min(Math.max(start, result), end)
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
export const randomIndex = (length: number): number => (Math.trunc(Math.random() * length))

/**
 * Flips a biased coin and returns true (heads) or false (tails)
 * @param {*} bias - the bias for favoring heads over tails.
 * By default it's set to 0.5, making it a fair coin
 * @returns the result of flipping the coin - true or false
 */
export const flipCoin = (bias: number = 0.5): boolean => (Math.random() <= bias)

/**
 * Computes the probability to use given the current fitness level.
 * Probability values for Crossover and Mutation are treated as parametric lines,
 * with fitness on the x-axis and probability on the y-axis.
 * This function solves that equation and returns the result.
 * @param {*} probabilityValues - the object of { startValue, endValue, startFitness, endFitness }
 * that defines a probability
 * @param {*} fitness - the current fitness of the organism
 * @returns - the current probability that should be used for the organism with the given fitness
 */
export const computeProb = ({
  startValue,
  endValue,
  startFitness,
  endFitness
}: ProbabilityParameters, fitness: number): number => {
  if (fitness <= startFitness) return startValue
  if (fitness >= endFitness) return endValue
  const slope = (endValue - startValue) / (endFitness - startFitness)
  const intercept = startValue - slope * startFitness
  return fitness * slope + intercept
}
