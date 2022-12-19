import { maxColorValue } from '../constants';
import * as utils from '../globals/statsUtils';
import Chromosome, { Test } from '../models/chromosomes';

const mockRandom = (outputs) => {
  let index = -1;

  return (() => {
    index += 1;
    return outputs[index];
  });
};

const expectRange = (value, min, max) => {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Chromosome Initialization', () => {
  test('Random Color Value Creation (Mock Random)', () => {
    // Check that the function is called once and returns the expected value
    const spy = jest.spyOn(utils, 'randomInt');
    spy.mockImplementation(mockRandom([-1]));
    const result = Test.randCV();
    expect(result).toEqual(-1);
    expect(utils.randomInt).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Random Color Value Creation (True Random)', () => {
    // Check that the actual function returns a value in the correct range
    const spy = jest.spyOn(utils, 'randomInt');
    const result = Test.randCV();
    expectRange(result, 0, maxColorValue);
    expect(utils.randomInt).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Random Color Creation (True Random)', () => {
    const result = Test.randomColor();
    expect(result.length).toEqual(4);
    expectRange(result[0], 0, maxColorValue); // red
    expectRange(result[1], 0, maxColorValue); // green
    expectRange(result[2], 0, maxColorValue); // blue
    expectRange(result[3], 0, 1); // alpha
  });

  test('RandomPoint Creation (Mock Random)', () => {
    const spy = jest.spyOn(utils, 'rand');
    spy.mockImplementation(mockRandom([-1, -1]));
    const result = Test.randomPoint();
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(-1);
    expect(result[1]).toEqual(-1);
    expect(utils.rand).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('RandomPoint Creation (True Random)', () => {
    const spy = jest.spyOn(utils, 'rand');
    const result = Test.randomPoint();
    expect(result.length).toBe(2);
    expectRange(result[0], 0, 1);
    expectRange(result[1], 0, 1);
    expect(utils.rand).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('Random Points Creation', () => {
    const result = Test.randomPoints();
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
