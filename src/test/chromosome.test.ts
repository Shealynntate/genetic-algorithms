import { expectRange, mockRandom } from './utils'
import { maxColorValue } from '../constants/constants'
import { genRange } from '../utils/utils'
import * as statsUtils from '../utils/statsUtils'
import ChromosomeModel from '../population/chromosomeModel'
import MutationModel from '../population/mutationModel'

// Test Helper Functions
// --------------------------------------------------
const PlaceholderProbability = 0

class MockMutationModel extends MutationModel {
  constructor () {
    super({
      distributions: {
        colorSigma: 0,
        pointSigma: 0
      },
      probabilities: {
        tweakColor: PlaceholderProbability,
        tweakPoint: PlaceholderProbability,
        addPoint: PlaceholderProbability,
        removePoint: PlaceholderProbability,
        addChromosome: PlaceholderProbability,
        removeChromosome: PlaceholderProbability,
        permuteChromosomes: PlaceholderProbability
      },
      genomeSize: 0
    })
  }
}

afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

// --------------------------------------------------
describe('Chromosome Initialization Helpers', () => {
  test('Random Color Value (Mock Random)', () => {
    // Check that the function is called once and returns the expected value
    const spy = jest.spyOn(statsUtils, 'randomInt')
    spy.mockImplementation(mockRandom([-1]))
    const result = ChromosomeModel.randCV()
    expect(result).toEqual(-1)
    expect(statsUtils.randomInt).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('Random Color Value (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      // Check that the actual function returns a value in the correct range
      const spy = jest.spyOn(statsUtils, 'randomInt')
      const result = ChromosomeModel.randCV()
      expectRange(result, 0, maxColorValue)
      expect(statsUtils.randomInt).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })
  })

  test('Random Color (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = ChromosomeModel.randomColor()
      expect(result.length).toEqual(4)
      expectRange(result[0], 0, maxColorValue) // red
      expectRange(result[1], 0, maxColorValue) // green
      expectRange(result[2], 0, maxColorValue) // blue
      expectRange(result[3], 0, 1) // alpha
    })
  })

  test('Random Transparent Color (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const result = ChromosomeModel.randomColor()
      expect(result.length).toEqual(4)
      expectRange(result[0], 0, maxColorValue) // red
      expectRange(result[1], 0, maxColorValue) // green
      expectRange(result[2], 0, maxColorValue) // blue
      expect(result[3]).toBe(0) // alpha
    })
  })

  test('Random Point Creation (Mock Random)', () => {
    const spy = jest.spyOn(statsUtils, 'rand')
    spy.mockImplementation(mockRandom([-1, -1]))
    const result = ChromosomeModel.randomPoint()
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(-1)
    expect(result[1]).toEqual(-1)
    expect(statsUtils.rand).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })

  test('RandomPoint Creation (True Random)', () => {
    // Test it 3 times
    genRange(3).forEach(() => {
      const spy = jest.spyOn(statsUtils, 'rand')
      const result = ChromosomeModel.randomPoint()
      expect(result.length).toBe(2)
      expectRange(result[0], 0, 1)
      expectRange(result[1], 0, 1)
      expect(statsUtils.rand).toHaveBeenCalledTimes(2)
      spy.mockRestore()
    })
  })
})

// --------------------------------------------------
describe('Chromosome Mutation Utils', () => {
  test('Tweak Point Zero Amount', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.pointNudge = () => 0

    const result = ChromosomeModel.tweakPoint(mockMutation, 1, 1)
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(1)
    expect(result[1]).toEqual(1)
  })

  test('Tweak Point Small Amount', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.pointNudge = () => 0.1

    const result = ChromosomeModel.tweakPoint(mockMutation, 0.5, 0.5)
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(0.6)
    expect(result[1]).toEqual(0.6)
  })

  test('Tweak Point Max Value Clamping', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.pointNudge = () => 0.2

    const result = ChromosomeModel.tweakPoint(mockMutation, 1, 0.9)
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(1)
    expect(result[1]).toEqual(1)
  })

  test('Tweak Point Min Value Clamping', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.pointNudge = () => -0.2

    const result = ChromosomeModel.tweakPoint(mockMutation, 0, 0.1)
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(0)
    expect(result[1]).toEqual(0)
  })

  test('Tweak Color Zero Amount', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0

    const result = ChromosomeModel.tweakColor(mockMutation, 100)
    expect(result).toEqual(100)
  })

  test('Tweak Color Small Amount', () => {
    const start = 100
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0.1

    const result = ChromosomeModel.tweakColor(mockMutation, start)
    expect(result).toEqual(0.1 * maxColorValue + start)
  })

  test('Tweak Color Max Value Clamping', () => {
    const start = 200
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0.5

    const result = ChromosomeModel.tweakColor(mockMutation, start)
    expect(result).toEqual(maxColorValue)
  })

  test('Tweak Color Min Value Clamping', () => {
    const start = 20
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => -0.5

    const result = ChromosomeModel.tweakColor(mockMutation, start)
    expect(result).toEqual(0)
  })

  test('Tweak Alpha Zero Amount', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0

    const result = ChromosomeModel.tweakAlpha(mockMutation, 0.5)
    expect(result).toEqual(0.5)
  })

  test('Tweak Alpha Small Amount', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0.1

    const result = ChromosomeModel.tweakAlpha(mockMutation, 0.5)
    expect(result).toEqual(0.6)
  })

  test('Tweak Alpha Max Value Clamping', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => 0.5

    const result = ChromosomeModel.tweakAlpha(mockMutation, 0.8)
    expect(result).toEqual(1)
  })

  test('Tweak Alpha Min Value Clamping', () => {
    const mockMutation = new MockMutationModel()
    mockMutation.colorNudge = () => -0.5

    const result = ChromosomeModel.tweakAlpha(mockMutation, 0.2)
    expect(result).toEqual(0)
  })
})

// --------------------------------------------------
describe('Chromosome Initialization', () => {
  test('Create A Random Chromosome', () => {
    // Create one with just 1 side
    const mockColor = [50, 100, 200, 0]
    const mockPoint = [0.5, 0.5]
    const mockPoints = [mockPoint, mockPoint, mockPoint]
    jest.spyOn(ChromosomeModel, 'randomColor').mockReturnValue(mockColor)
    // jest.spyOn(ChromosomeModel, 'randomPoints').mockReturnValue(mockPoints)
    const chrom1 = ChromosomeModel.create({ numSides: 1 })
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(1)
    // expect(ChromosomeModel.randomPoints).toBeCalledWith(1)
    // expect(ChromosomeModel.randomPoints).toHaveBeenCalledTimes(1)
    expect(chrom1.points).toEqual(mockPoints)
    expect(chrom1.color).toEqual(mockColor)

    jest.restoreAllMocks()

    // Create one with 3 sides
    jest.spyOn(ChromosomeModel, 'randomColor').mockReturnValue(mockColor)
    const chrom2 = ChromosomeModel.create({ numSides: 3 })
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(1)
    expect(chrom2.points).toEqual(mockPoints)
    expect(chrom2.color).toEqual(mockColor)
  })

  test('Create A Chromosome With Fixed Points and Color', () => {
    const points = [[1, 2], [3, 4], [5, 6]]
    const color = [1, 2, 3, 0]
    jest.spyOn(ChromosomeModel, 'randomColor')
    // jest.spyOn(ChromosomeModel, 'randomPoints')
    const chrom = ChromosomeModel.clone({ color, points })
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(0)
    // expect(ChromosomeModel.randomPoints).toHaveBeenCalledTimes(0)
    expect(chrom.points).toEqual(points)
    expect(chrom.color).toEqual(color)
  })
})
