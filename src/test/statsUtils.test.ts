import { testDistrubution, testDistrubutionAverage } from './utils'
import { genRange } from '../utils/utils'
import {
  computeProb,
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

  test('Verify computeProb functionality', () => {
    const v1 = {
      startValue: 0,
      endValue: 1,
      startFitness: 0,
      endFitness: 1
    }
    // Check for the expected results
    const p1 = computeProb(v1, 0)
    const p2 = computeProb(v1, 1)
    const p3 = computeProb(v1, 0.5)
    expect(p1).toEqual(0)
    expect(p2).toEqual(1)
    expect(p3).toEqual(0.5)
    // Check a line with negative slope
    const v2 = {
      startValue: 1,
      endValue: 0,
      startFitness: 0,
      endFitness: 1
    }
    const p4 = computeProb(v2, 0)
    const p5 = computeProb(v2, 1)
    const p6 = computeProb(v2, 0.5)
    expect(p4).toEqual(1)
    expect(p5).toEqual(0)
    expect(p6).toEqual(0.5)
    // Check that clamping works
    const v3 = {
      startValue: 0,
      endValue: 1,
      startFitness: 0.25,
      endFitness: 0.75
    }
    const p7 = computeProb(v3, 0)
    const p8 = computeProb(v3, 1)
    const p9 = computeProb(v3, 0.5)
    expect(p7).toEqual(0)
    expect(p8).toEqual(1)
    expect(p9).toEqual(0.5)
    // Check that a flat line works
    const v4 = {
      startValue: 0.01,
      endValue: 0.01,
      startFitness: 0,
      endFitness: 1
    }
    const p10 = computeProb(v4, 0)
    const p11 = computeProb(v4, 0.9)
    const p12 = computeProb(v4, 1)
    expect(p10).toEqual(0.01)
    expect(p11).toEqual(0.01)
    expect(p12).toEqual(0.01)
  })
})
