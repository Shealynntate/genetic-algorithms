import _ from 'lodash'
import { setSigFigs } from '../utils/utils'

// Helper Functions used across Tests
// --------------------------------------------------
export const expectRange = (value: number, min: number, max: number): void => {
  expect(value).toBeGreaterThanOrEqual(min)
  expect(value).toBeLessThanOrEqual(max)
}

export const mockRandom = (outputs: number[]): () => number => {
  let index = -1

  return (): number => {
    index += 1
    return outputs[index]
  }
}

export const testDistrubution = (entries: Record<number, number>, lower: number, upper: number, ideal: number[] | number): void => {
  Object.entries(entries).forEach(([key, value], i) => {
    // Check that only the expected keys exist
    expectRange(parseInt(key, 10), lower, upper)
    // Expect a less than 5% deviation from an idialized distribution
    const comp = Array.isArray(ideal) ? ideal[i] : ideal
    const ratio = setSigFigs(Math.abs(value - comp) / comp, 3)
    expect(ratio).toBeLessThanOrEqual(0.05)
  })
}

export const testDistrubutionAverage = (entries: number[], lower: number, upper: number, average: number): void => {
  entries.forEach((entry) => {
    // Check that only the expected keys exist
    expectRange(entry, lower, upper)
  })
  // Expect a less than 5% deviation from an idialized distribution
  const mean = _.sum(entries) / entries.length
  const ratio = setSigFigs(Math.abs(mean - average) / average, 3)
  expect(ratio).toBeLessThanOrEqual(0.05)
}
