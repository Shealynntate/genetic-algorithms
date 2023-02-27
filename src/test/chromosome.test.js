import { expectRange, mockRandom } from './utils';
import { maxColorValue } from '../constants/constants';
import { genRange } from '../utils/utils';
import * as statsUtils from '../utils/statsUtils';
import Chromosome, { Test } from '../models/chromosome';

// Test Helper Functions
// --------------------------------------------------
afterEach(() => {
  jest.clearAllMocks();
});

// --------------------------------------------------
describe('Chromosome Initialization', () => {
  test('Random Color Value Creation (Mock Random)', () => {
    // Check that the function is called once and returns the expected value
    const spy = jest.spyOn(statsUtils, 'randomInt');
    spy.mockImplementation(mockRandom([-1]));
    const result = Test.randCV();
    expect(result).toEqual(-1);
    expect(statsUtils.randomInt).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Random Color Value Creation (True Random)', () => {
    // Check that the actual function returns a value in the correct range
    const spy = jest.spyOn(statsUtils, 'randomInt');
    const result = Test.randCV();
    expectRange(result, 0, maxColorValue);
    expect(statsUtils.randomInt).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Random Color Creation (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = Test.randomColor();
      expect(result.length).toEqual(4);
      expectRange(result[0], 0, maxColorValue); // red
      expectRange(result[1], 0, maxColorValue); // green
      expectRange(result[2], 0, maxColorValue); // blue
      expectRange(result[3], 0, 1); // alpha
    });
  });

  test('Random Transparent Color Creation (True Random', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = Test.transparent();
      expect(result.length).toEqual(4);
      expectRange(result[0], 0, maxColorValue); // red
      expectRange(result[1], 0, maxColorValue); // green
      expectRange(result[2], 0, maxColorValue); // blue
      expect(result[3]).toBe(0); // alpha
    });
  });

  test('Random Point Creation (Mock Random)', () => {
    const spy = jest.spyOn(statsUtils, 'rand');
    spy.mockImplementation(mockRandom([-1, -1]));
    const result = Test.randomPoint();
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(-1);
    expect(result[1]).toEqual(-1);
    expect(statsUtils.rand).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('RandomPoint Creation (True Random)', () => {
    const spy = jest.spyOn(statsUtils, 'rand');
    const result = Test.randomPoint();
    expect(result.length).toBe(2);
    expectRange(result[0], 0, 1);
    expectRange(result[1], 0, 1);
    expect(statsUtils.rand).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('Random Points Creation', () => {
    const result = Test.randomPoints(3);
    expect(result.length).toEqual(3);
    result.forEach((point) => {
      expectRange(point[0], 0, 1);
      expectRange(point[1], 0, 1);
    });
  });
});

describe('Chromosome Crossover', () => {
  test('Crossover Point', () => {
    const points1 = [[1, 1], [1, 1], [1, 1]];
    const points2 = [[2, 2], [2, 2], [2, 2]];
    const chromosomes1 = Chromosome.create({ points: points1 });
    const chromosomes2 = Chromosome.create({ points: points2 });

    Test.crossoverPoint(chromosomes1, chromosomes2, 1);
    expect(chromosomes1.points).toEqual([[1, 1], [2, 2], [2, 2]]);
    expect(chromosomes2.points).toEqual([[2, 2], [1, 1], [1, 1]]);
  });
});
