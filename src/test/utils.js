import _ from 'lodash';
import { setSigFigs } from '../utils/utils';

// Helper Functions used across Tests
// --------------------------------------------------
export const expectRange = (value, min, max) => {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
};

export const mockRandom = (outputs) => {
  let index = -1;

  return (() => {
    index += 1;
    return outputs[index];
  });
};

export const testDistrubution = (entries, lower, upper, ideal) => {
  Object.entries(entries).forEach(([key, value], i) => {
    // Check that only the expected keys exist
    expectRange(parseInt(key, 10), lower, upper);
    // Expect a less than 5% deviation from an idialized distribution
    const comp = Array.isArray(ideal) ? ideal[i] : ideal;
    const ratio = setSigFigs(Math.abs(value - comp) / comp, 3);
    expect(ratio).toBeLessThanOrEqual(0.05);
  });
};

export const testDistrubutionAverage = (entries, lower, upper, average) => {
  entries.forEach((entry) => {
    // Check that only the expected keys exist
    expectRange(entry, lower, upper);
  });
  // Expect a less than 5% deviation from an idialized distribution
  const mean = _.sum(entries) / entries.length;
  const ratio = setSigFigs(Math.abs(mean - average) / average, 3);
  expect(ratio).toBeLessThanOrEqual(0.05);
};
