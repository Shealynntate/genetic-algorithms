// General Purpose Helper Functions
// --------------------------------------------------

/**
 * Creates an array of numbers, provides an easy way to loop
 * max number of times without creating an explicit for loop
 * @param {*} max the upper bound of the array
 * @returns an array of sequential numbers from 0 to max
 */
export const genRange = (max: number): number[] => [...Array(max).keys()]

/**
 * Sets the number of significant figures for an input number
 * @param {*} value a floating point number
 * @param {*} sigFigs the number of digits after the decimal point you want to preserve
 * @returns the new value with the appropriate number of significant figures
 */
export const setSigFigs = (value: number, sigFigs: number): number => {
  const m = 10 ** sigFigs
  return Math.round(value * m) / m
}

/**
 * Compares two floating point numbers up to the thousandths place
 * @param {*} a - a floating point number to compare
 * @param {*} b - a floating point number to compare
 * @returns true if the values are approximately equal and false otherwise
 */
export const approxEqual = (a: number, b: number): boolean =>
  setSigFigs(a, 3) === setSigFigs(b, 3)

/**
 * A Typescript friendly version of Object.keys.
 * Casts the return value to an array of the object's keys.
 * @param obj the object to get the keys of
 * @returns an array of the object's keys cast to the appropriate type
 */
export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}
