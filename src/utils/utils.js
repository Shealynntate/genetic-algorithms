// General Purpose Helper Functions
// --------------------------------------------------

/**
 * Creates an array of numbers, provides an easy way to loop
 * max number of times without creating an explicit for loop
 * @param {*} max the upper bound of the array
 * @returns an array of sequential numbers from 0 to max
 */
export const genRange = (max) => ([...Array(max).keys()]);

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
