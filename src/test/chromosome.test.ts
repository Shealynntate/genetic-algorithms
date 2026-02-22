import { expectRange, mockRandom } from './utils'
import { genRange } from '../common/utils'
import ChromosomeModel from '../population/chromosomeModel'
import MutationModel from '../population/mutationModel'
import { maxColorValue } from '../simulation/config'
import * as statsUtils from '../utils/statsUtils'

// Test Helper Functions
// --------------------------------------------------
const PlaceholderProbability = 0

class MockMutationModel extends MutationModel {
  constructor() {
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
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

// --------------------------------------------------
describe('Chromosome Initialization Helpers', () => {
  test('Random Color Value (Mock Random)', () => {
    const spy = vi.spyOn(statsUtils, 'randomInt')
    spy.mockImplementation(mockRandom([-1]))
    const result = ChromosomeModel.randCV()
    expect(result).toEqual(-1)
    expect(statsUtils.randomInt).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('Random Color Value (True Random)', () => {
    genRange(3).forEach(() => {
      const spy = vi.spyOn(statsUtils, 'randomInt')
      const result = ChromosomeModel.randCV()
      expectRange(result, 0, maxColorValue)
      expect(statsUtils.randomInt).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })
  })

  test('Random Color (True Random)', () => {
    genRange(3).forEach(() => {
      const result = ChromosomeModel.randomColor()
      expectRange(result.r, 0, maxColorValue)
      expectRange(result.g, 0, maxColorValue)
      expectRange(result.b, 0, maxColorValue)
      expectRange(result.a, 0, 1)
    })
  })

  test('Random Transparent Color (True Random)', () => {
    genRange(3).forEach(() => {
      const result = ChromosomeModel.randomColor()
      expectRange(result.r, 0, maxColorValue)
      expectRange(result.g, 0, maxColorValue)
      expectRange(result.b, 0, maxColorValue)
      expectRange(result.a, 0, 1)
    })
  })

  test('Random Point Creation', () => {
    genRange(3).forEach(() => {
      const result = ChromosomeModel.randomPoint()
      expect(typeof result.x).toBe('number')
      expect(typeof result.y).toBe('number')
    })
  })
})

// --------------------------------------------------
describe('Chromosome Mutation Utils', () => {
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
    expect(result).toEqual(Math.round(0.1 * maxColorValue + start))
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
    const mockColor = { r: 50, g: 100, b: 200, a: 0 }
    const mockPoint = { x: 0.5, y: 0.5 }

    vi.spyOn(ChromosomeModel, 'randomColor').mockReturnValue(mockColor)
    vi.spyOn(ChromosomeModel, 'randomPoint').mockReturnValue(mockPoint)
    vi.spyOn(statsUtils, 'randomFloat').mockReturnValue(0)

    // numSides: 1 produces 1 point
    const chrom1 = ChromosomeModel.create({ numSides: 1 })
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(1)
    expect(chrom1.points).toHaveLength(1)
    expect(chrom1.points[0].x).toBeCloseTo(mockPoint.x, 2)
    expect(chrom1.points[0].y).toBeCloseTo(mockPoint.y, 2)
    expect(chrom1.color.r).toBe(mockColor.r)
    expect(chrom1.color.g).toBe(mockColor.g)
    expect(chrom1.color.b).toBe(mockColor.b)
    expect(chrom1.color.a).toBe(mockColor.a)

    vi.restoreAllMocks()

    // numSides: 3 produces 3 points
    vi.spyOn(ChromosomeModel, 'randomColor').mockReturnValue(mockColor)
    vi.spyOn(ChromosomeModel, 'randomPoint').mockReturnValue(mockPoint)
    vi.spyOn(statsUtils, 'randomFloat').mockReturnValue(0)

    const chrom2 = ChromosomeModel.create({ numSides: 3 })
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(1)
    expect(chrom2.points).toHaveLength(3)
    for (let i = 0; i < 3; i++) {
      expect(chrom2.points[i].x).toBeCloseTo(mockPoint.x, 2)
      expect(chrom2.points[i].y).toBeCloseTo(mockPoint.y, 2)
    }
    expect(chrom2.color.r).toBe(mockColor.r)
  })

  test('Create A Chromosome Clone With Fixed Points and Color', () => {
    const original = {
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 6 }
      ],
      color: { r: 1, g: 2, b: 3, a: 0 }
    }
    vi.spyOn(ChromosomeModel, 'randomColor')
    const chrom = ChromosomeModel.clone(original)
    expect(ChromosomeModel.randomColor).toHaveBeenCalledTimes(0)
    // Verify data matches
    expect(chrom.points).toEqual(original.points)
    expect(chrom.color).toEqual(original.color)
  })
})

// --------------------------------------------------
describe('Chromosome Cloning', () => {
  test('clone produces independent copy', () => {
    const original = ChromosomeModel.create({ numSides: 3 })
    const clone = ChromosomeModel.clone(original)

    // Mutate clone
    clone.color.r = 999
    clone.points[0].x = 999

    // Original unchanged
    expect(original.color.r).not.toBe(999)
    expect(original.points[0].x).not.toBe(999)
  })
})
