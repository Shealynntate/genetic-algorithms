import { expectRange, mockRandom } from './utils';
import { maxColorValue } from '../constants/constants';
import { genRange } from '../utils/utils';
import * as statsUtils from '../utils/statsUtils';
import * as ChromosomeUtils from '../models/chromosomeUtils';
import Chromosome from '../models/chromosome';

// Test Helper Functions
// --------------------------------------------------
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// --------------------------------------------------
describe('Chromosome Initialization Helpers', () => {
  test('Random Color Value (Mock Random)', () => {
    // Check that the function is called once and returns the expected value
    const spy = jest.spyOn(statsUtils, 'randomInt');
    spy.mockImplementation(mockRandom([-1]));
    const result = ChromosomeUtils.randCV();
    expect(result).toEqual(-1);
    expect(statsUtils.randomInt).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Random Color Value (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      // Check that the actual function returns a value in the correct range
      const spy = jest.spyOn(statsUtils, 'randomInt');
      const result = ChromosomeUtils.randCV();
      expectRange(result, 0, maxColorValue);
      expect(statsUtils.randomInt).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  test('Random Color (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = ChromosomeUtils.randomColor();
      expect(result.length).toEqual(4);
      expectRange(result[0], 0, maxColorValue); // red
      expectRange(result[1], 0, maxColorValue); // green
      expectRange(result[2], 0, maxColorValue); // blue
      expectRange(result[3], 0, 1); // alpha
    });
  });

  test('Random Transparent Color (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = ChromosomeUtils.transparent();
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
    const result = ChromosomeUtils.randomPoint();
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(-1);
    expect(result[1]).toEqual(-1);
    expect(statsUtils.rand).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('RandomPoint Creation (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const spy = jest.spyOn(statsUtils, 'rand');
      const result = ChromosomeUtils.randomPoint();
      expect(result.length).toBe(2);
      expectRange(result[0], 0, 1);
      expectRange(result[1], 0, 1);
      expect(statsUtils.rand).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });
  });

  test('Random Points Creation (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = ChromosomeUtils.randomPoints(3);
      expect(result.length).toEqual(3);
      result.forEach((point) => {
        expectRange(point[0], 0, 1);
        expectRange(point[1], 0, 1);
      });
    });
  });
});

// --------------------------------------------------
describe('Chromosome Mutation Utils', () => {
  test('Tweak Point Zero Amount', () => {
    const mockMutation = {
      pointNudge: () => 0,
    };
    const result = ChromosomeUtils.tweakPoint(mockMutation, 1, 1);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(1);
    expect(result[1]).toEqual(1);
  });

  test('Tweak Point Small Amount', () => {
    const mockMutation = {
      pointNudge: () => 0.1,
    };
    const result = ChromosomeUtils.tweakPoint(mockMutation, 0.5, 0.5);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(0.6);
    expect(result[1]).toEqual(0.6);
  });

  test('Tweak Point Max Value Clamping', () => {
    const mockMutation = {
      pointNudge: () => 0.2,
    };
    const result = ChromosomeUtils.tweakPoint(mockMutation, 1, 0.9);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(1);
    expect(result[1]).toEqual(1);
  });

  test('Tweak Point Min Value Clamping', () => {
    const mockMutation = {
      pointNudge: () => -0.2,
    };
    const result = ChromosomeUtils.tweakPoint(mockMutation, 0, 0.1);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(0);
    expect(result[1]).toEqual(0);
  });
});

// --------------------------------------------------
describe('Chromosome Initialization', () => {
  test('Create A Random Chromosome', () => {
    // Create one with just 1 side
    const mockColor = [50, 100, 200, 0];
    const mockPoint = [0.5, 0.5];
    const mockPoints = [mockPoint, mockPoint, mockPoint];
    jest.spyOn(ChromosomeUtils, 'transparent').mockReturnValue(mockColor);
    jest.spyOn(ChromosomeUtils, 'randomPoints').mockReturnValue(mockPoint);
    const chrom1 = Chromosome.create({ numSides: 1 });
    expect(ChromosomeUtils.transparent).toHaveBeenCalledTimes(1);
    expect(ChromosomeUtils.randomPoints).toBeCalledWith(1);
    expect(ChromosomeUtils.randomPoints).toHaveBeenCalledTimes(1);
    expect(chrom1.points).toEqual(mockPoint);
    expect(chrom1.color).toEqual(mockColor);

    jest.restoreAllMocks();

    // Create one with 3 sides
    jest.spyOn(ChromosomeUtils, 'transparent').mockReturnValue(mockColor);
    jest.spyOn(ChromosomeUtils, 'randomPoints').mockReturnValue(mockPoints);
    const chrom2 = Chromosome.create({ numSides: 3 });
    expect(ChromosomeUtils.transparent).toHaveBeenCalledTimes(1);
    expect(ChromosomeUtils.randomPoints).toBeCalledWith(3);
    expect(ChromosomeUtils.randomPoints).toHaveBeenCalledTimes(1);
    expect(chrom2.points).toEqual(mockPoints);
    expect(chrom2.color).toEqual(mockColor);
  });

  test('Create A Chromosome With Fixed Points and Color', () => {
    const points = [[1, 2], [3, 4], [5, 6]];
    const color = [1, 2, 3, 0];
    jest.spyOn(ChromosomeUtils, 'transparent');
    jest.spyOn(ChromosomeUtils, 'randomPoints');
    const chrom = Chromosome.create({ color, points });
    expect(ChromosomeUtils.transparent).toHaveBeenCalledTimes(0);
    expect(ChromosomeUtils.randomPoints).toHaveBeenCalledTimes(0);
    expect(chrom.points).toEqual(points);
    expect(chrom.color).toEqual(color);
  });
});
