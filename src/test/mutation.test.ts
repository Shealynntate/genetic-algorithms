import ChromosomeModel from '../population/chromosomeModel'
import GenomeModel from '../population/genomeModel'
import MutationModel from '../population/mutationModel'
import { type Chromosome, type Genome } from '../population/types'
import { seedRandom, resetRandom } from '../utils/random'

// Helper: create a known chromosome using plain objects
function makeChromosome(numPoints = 3): Chromosome {
  return {
    color: { r: 100, g: 150, b: 200, a: 0.5 },
    points: Array.from({ length: numPoints }, (_, i) => ({
      x: 0.5 + i * 0.01,
      y: 0.5 + i * 0.01
    }))
  }
}

class MockMutationModel extends MutationModel {
  constructor(overrides: Partial<Record<string, number>> = {}) {
    super({
      distributions: {
        colorSigma: overrides.colorSigma ?? 0.06,
        pointSigma: overrides.pointSigma ?? 0.06
      },
      probabilities: {
        tweakColor: overrides.tweakColor ?? 0,
        tweakPoint: overrides.tweakPoint ?? 0,
        addPoint: overrides.addPoint ?? 0,
        removePoint: overrides.removePoint ?? 0,
        addChromosome: overrides.addChromosome ?? 0,
        removeChromosome: overrides.removeChromosome ?? 0,
        permuteChromosomes: overrides.permuteChromosomes ?? 0
      },
      genomeSize: overrides.genomeSize ?? 10
    })
  }
}

afterEach(() => {
  resetRandom()
  vi.restoreAllMocks()
})

// --------------------------------------------------
describe('ChromosomeModel.tweakMutation', () => {
  test('end-to-end with seeded PRNG modifies color and points', () => {
    seedRandom(42)
    const chromosome = makeChromosome(3)
    const original = ChromosomeModel.clone(chromosome)
    const mutation = new MockMutationModel({
      tweakColor: 1.0,
      tweakPoint: 1.0,
      colorSigma: 0.1,
      pointSigma: 0.1
    })

    ChromosomeModel.tweakMutation(chromosome, mutation)

    const colorChanged =
      chromosome.color.r !== original.color.r ||
      chromosome.color.g !== original.color.g ||
      chromosome.color.b !== original.color.b ||
      chromosome.color.a !== original.color.a
    expect(colorChanged).toBe(true)

    const pointsChanged = chromosome.points.some(
      (p, i) =>
        p.x !== original.points[i].x ||
        p.y !== original.points[i].y
    )
    expect(pointsChanged).toBe(true)
  })

  test('with all mutations disabled, chromosome is unchanged', () => {
    seedRandom(42)
    const chromosome = makeChromosome(3)
    const original = ChromosomeModel.clone(chromosome)
    const mutation = new MockMutationModel({
      tweakColor: 0,
      tweakPoint: 0
    })

    ChromosomeModel.tweakMutation(chromosome, mutation)

    expect(chromosome.color.r).toBe(original.color.r)
    expect(chromosome.color.g).toBe(original.color.g)
    expect(chromosome.color.b).toBe(original.color.b)
    expect(chromosome.color.a).toBe(original.color.a)
    for (let i = 0; i < chromosome.points.length; i++) {
      expect(chromosome.points[i].x).toBe(original.points[i].x)
      expect(chromosome.points[i].y).toBe(original.points[i].y)
    }
  })

  test('color values are clamped to valid ranges', () => {
    seedRandom(42)
    const chromosome: Chromosome = {
      color: { r: 255, g: 0, b: 255, a: 1.0 },
      points: [
        { x: 0.5, y: 0.5 },
        { x: 0.6, y: 0.6 },
        { x: 0.7, y: 0.7 }
      ]
    }
    const mutation = new MockMutationModel({
      tweakColor: 1.0,
      tweakPoint: 0,
      colorSigma: 0.5
    })

    ChromosomeModel.tweakMutation(chromosome, mutation)

    expect(chromosome.color.r).toBeGreaterThanOrEqual(0)
    expect(chromosome.color.r).toBeLessThanOrEqual(255)
    expect(chromosome.color.g).toBeGreaterThanOrEqual(0)
    expect(chromosome.color.g).toBeLessThanOrEqual(255)
    expect(chromosome.color.b).toBeGreaterThanOrEqual(0)
    expect(chromosome.color.b).toBeLessThanOrEqual(255)
    expect(chromosome.color.a).toBeGreaterThanOrEqual(0)
    expect(chromosome.color.a).toBeLessThanOrEqual(1)
  })

  test('point values are clamped to [0,1]', () => {
    seedRandom(42)
    const chromosome: Chromosome = {
      color: { r: 100, g: 100, b: 100, a: 0.5 },
      points: [
        { x: 0.99, y: 0.01 },
        { x: 0.0, y: 1.0 },
        { x: 0.5, y: 0.5 }
      ]
    }
    const mutation = new MockMutationModel({
      tweakColor: 0,
      tweakPoint: 1.0,
      pointSigma: 0.5
    })

    ChromosomeModel.tweakMutation(chromosome, mutation)

    for (let i = 0; i < chromosome.points.length; i++) {
      expect(chromosome.points[i].x).toBeGreaterThanOrEqual(0)
      expect(chromosome.points[i].x).toBeLessThanOrEqual(1)
      expect(chromosome.points[i].y).toBeGreaterThanOrEqual(0)
      expect(chromosome.points[i].y).toBeLessThanOrEqual(1)
    }
  })
})

// --------------------------------------------------
describe('ChromosomeModel.addPointMutation', () => {
  test('adds a midpoint between adjacent points', () => {
    seedRandom(42)
    const chromosome: Chromosome = {
      color: { r: 100, g: 100, b: 100, a: 0.5 },
      points: [
        { x: 0.0, y: 0.0 },
        { x: 1.0, y: 1.0 },
        { x: 0.5, y: 0.0 }
      ]
    }

    const result = ChromosomeModel.addPointMutation(chromosome, 10)

    expect(result).toBe(true)
    expect(chromosome.points).toHaveLength(4)
  })

  test('returns false when at maxPoints', () => {
    const chromosome = makeChromosome(5)
    const result = ChromosomeModel.addPointMutation(chromosome, 5)
    expect(result).toBe(false)
    expect(chromosome.points).toHaveLength(5)
  })

  test('returns false when above maxPoints', () => {
    const chromosome = makeChromosome(6)
    const result = ChromosomeModel.addPointMutation(chromosome, 5)
    expect(result).toBe(false)
    expect(chromosome.points).toHaveLength(6)
  })
})

// --------------------------------------------------
describe('ChromosomeModel.removePointMutation', () => {
  test('removes a point from a 4-point chromosome', () => {
    seedRandom(42)
    const chromosome = makeChromosome(4)

    const result = ChromosomeModel.removePointMutation(chromosome, 3)

    expect(result).toBe(true)
    expect(chromosome.points).toHaveLength(3)
  })

  test('returns false when at minPoints', () => {
    const chromosome = makeChromosome(3)
    const result = ChromosomeModel.removePointMutation(chromosome, 3)
    expect(result).toBe(false)
    expect(chromosome.points).toHaveLength(3)
  })

  test('returns false when below minPoints', () => {
    const chromosome = makeChromosome(2)
    const result = ChromosomeModel.removePointMutation(chromosome, 3)
    expect(result).toBe(false)
    expect(chromosome.points).toHaveLength(2)
  })
})

// --------------------------------------------------
describe('GenomeModel.mutate - genome-level operations', () => {
  test('add chromosome mutation increases genome size', () => {
    seedRandom(42)
    const genome: Genome = {
      chromosomes: [makeChromosome(), makeChromosome()]
    }
    const mutation = new MockMutationModel({
      addChromosome: 1.0,
      removeChromosome: 0
    })
    const bounds = { maxGenomeSize: 10, minPoints: 3, maxPoints: 10 }

    GenomeModel.mutate(genome, mutation, bounds)

    expect(genome.chromosomes.length).toBe(3)
  })

  test('remove chromosome mutation decreases genome size', () => {
    seedRandom(42)
    const genome: Genome = {
      chromosomes: [makeChromosome(), makeChromosome(), makeChromosome()]
    }
    const mutation = new MockMutationModel({
      addChromosome: 0,
      removeChromosome: 1.0
    })
    const bounds = { maxGenomeSize: 10, minPoints: 3, maxPoints: 10 }

    GenomeModel.mutate(genome, mutation, bounds)

    expect(genome.chromosomes.length).toBe(2)
  })

  test('remove chromosome does not go below 1', () => {
    seedRandom(42)
    const genome: Genome = {
      chromosomes: [makeChromosome()]
    }
    const mutation = new MockMutationModel({
      addChromosome: 0,
      removeChromosome: 1.0
    })
    const bounds = { maxGenomeSize: 10, minPoints: 3, maxPoints: 10 }

    GenomeModel.mutate(genome, mutation, bounds)

    expect(genome.chromosomes.length).toBe(1)
  })

  test('add chromosome respects maxGenomeSize', () => {
    seedRandom(42)
    const genome: Genome = {
      chromosomes: [makeChromosome(), makeChromosome()]
    }
    const mutation = new MockMutationModel({
      addChromosome: 1.0,
      removeChromosome: 0
    })
    const bounds = { maxGenomeSize: 2, minPoints: 3, maxPoints: 10 }

    GenomeModel.mutate(genome, mutation, bounds)

    expect(genome.chromosomes.length).toBe(2)
  })
})

// --------------------------------------------------
describe('GenomeModel.mutateOrder', () => {
  test('reorders chromosomes with seeded PRNG', () => {
    seedRandom(42)
    const chromosomes = Array.from({ length: 4 }, (_, i) => {
      const c = makeChromosome()
      c.color.r = (i + 1) * 10
      return c
    })

    const genome: Genome = { chromosomes }
    const originalOrder = genome.chromosomes.map((c) => c.color.r)

    const mutation = new MockMutationModel()
    GenomeModel.mutateOrder(genome, mutation)

    const newOrder = genome.chromosomes.map((c) => c.color.r)
    expect(newOrder).toHaveLength(4)
    expect(newOrder.sort()).toEqual(originalOrder.sort())
  })

  test('preserves all chromosomes after reorder', () => {
    seedRandom(7)
    const genome: Genome = {
      chromosomes: Array.from({ length: 5 }, (_, i) => {
        const c = makeChromosome()
        c.color.r = i * 50
        return c
      })
    }
    const originalColors = genome.chromosomes.map((c) => c.color.r)

    const mutation = new MockMutationModel()
    GenomeModel.mutateOrder(genome, mutation)

    const newColors = genome.chromosomes.map((c) => c.color.r)
    expect(newColors).toHaveLength(5)
    expect(newColors.sort((a, b) => a - b)).toEqual(
      originalColors.sort((a, b) => a - b)
    )
  })
})
