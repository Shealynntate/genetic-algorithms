import { testDistrubution, testDistrubutionAverage } from './utils'
import { genRange } from '../utils/utils'
import {
  flipCoin,
  rand,
  randomFloat,
  randomIndex,
  randomInt
} from '../utils/statsUtils'

// --------------------------------------------------
describe('Random Number Functions', () => {
  test('Verify rand functionality', () => {
    // Check that rounding to ints works
    const results1: Record<number, number> = { 0: 0, 1: 0 }
    genRange(1e5).forEach(() => {
      results1[rand(0)] += 1
    })
    testDistrubution(results1, 0, 2, 5e4)
    // Check that rounding to tens place works
    const results2: Record<number, number> = {}
    genRange(1e5).forEach(() => {
      const key = rand(1)
      results2[key] = (key in results2) ? results2[key] + 1 : 1
    })
    const ideal = genRange(11).map(() => 1e4)
    // Only half the ideal distribution will fall into the two extremes
    ideal[0] = 0.5e4
    ideal[1] = 0.5e4
    testDistrubution(results2, 0, 2, ideal)
  })

  test('Verify randomFloat functionality', () => {
    // Check a [0, 1) range
    const results1 = genRange(1e5).map(() => randomFloat(0, 1))
    // The Expected Value is 0.5, check that our average is within 1% of that
    testDistrubutionAverage(results1, 0, 1, 0.5)
    // Check a [5, 10) range
    const results2 = genRange(1e5).map(() => randomFloat(5, 10))
    // The Expected Value is 7.5, check that our average is within 1% of that
    testDistrubutionAverage(results2, 5, 10, 7.5)
  })

  test('Verify randomInt functionality', () => {
    // Check a [0, 5) range
    const results1: Record<number, number> = {}
    genRange(1e5).forEach(() => {
      const key = randomInt(0, 3)
      results1[key] = (key in results1) ? results1[key] + 1 : 1
    })
    // Expect each value to have 25% of the distribution
    testDistrubution(results1, 0, 4, 1e5 / 4)
    // Check a [5, 10) range
    const results2: Record<number, number> = {}
    genRange(1e5).forEach(() => {
      const key = randomInt(7, 10)
      results2[key] = (key in results2) ? results2[key] + 1 : 1
    })
    // Expect each value to have 25% of the distribution
    testDistrubution(results2, 7, 11, 1e5 / 4)
  })

  test('Verify randomIndex functionality', () => {
    // Setup a dictionary of ten 0 value entries
    const results: Record<number, number> = {}
    // Sample a ton of random indices and keep track of results
    genRange(1e5).forEach(() => {
      const key = randomIndex(10)
      results[key] = (key in results) ? results[key] + 1 : 1
    })

    testDistrubution(results, 0, 10, 1e4)
  })
})

// --------------------------------------------------
describe('Probability Functions', () => {
  test('Verify flipCoin functionality', () => {
    // Check a default, fair coin
    const results1: Record<number, number> = {}
    genRange(1e5).forEach(() => {
      const key = flipCoin() ? 1 : 0
      results1[key] = (key in results1) ? results1[key] + 1 : 1
    })
    testDistrubution(results1, 0, 2, 1e5 * 0.5)
    // Check a 0.8 biased coin
    const results2: Record<number, number> = {}
    genRange(1e5).forEach(() => {
      const key = flipCoin(0.8) ? 1 : 0
      results2[key] = (key in results2) ? results2[key] + 1 : 1
    })
    testDistrubution(results2, 0, 2, [1e5 * 0.2, 1e5 * 0.8])
  })
})
