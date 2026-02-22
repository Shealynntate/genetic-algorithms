import CrossoverModel from '../population/crossoverModel'
import GenomeModel from '../population/genomeModel'
import { type Chromosome, type Genome } from '../population/types'
import { seedRandom, resetRandom } from '../utils/random'

// Helper: create a chromosome with all points near a given value
function makeChromosome(value: number, numPoints = 3): Chromosome {
  return {
    color: {
      r: Math.round(value * 255),
      g: Math.round(value * 255),
      b: Math.round(value * 255),
      a: value
    },
    points: Array.from({ length: numPoints }, (_, i) => ({
      x: value + i * 0.001,
      y: value + i * 0.001
    }))
  }
}

function makeGenome(value: number, size: number, numPoints = 3): Genome {
  return {
    chromosomes: Array.from({ length: size }, () =>
      makeChromosome(value, numPoints)
    )
  }
}

afterEach(() => {
  resetRandom()
  vi.restoreAllMocks()
})

// --------------------------------------------------
describe('One-Point Crossover', () => {
  test('swaps chromosomes up to crossover point', () => {
    seedRandom(10)
    const parent1 = makeGenome(0.1, 4)
    const parent2 = makeGenome(0.9, 4)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 1.0 } // always swap
    })

    const [child1, child2] = GenomeModel.onePointCrossover(
      parent1,
      parent2,
      crossover
    )

    expect(child1.chromosomes).toHaveLength(4)
    expect(child2.chromosomes).toHaveLength(4)

    // With swap=1.0, child1 should have at least one chromosome from parent2
    const child1HasParent2 = child1.chromosomes.some(
      (c) => c.color.r === Math.round(0.9 * 255)
    )
    expect(child1HasParent2).toBe(true)

    const child2HasParent1 = child2.chromosomes.some(
      (c) => c.color.r === Math.round(0.1 * 255)
    )
    expect(child2HasParent1).toBe(true)
  })

  test('no-swap returns clones of respective parents', () => {
    seedRandom(42)
    const parent1 = makeGenome(0.1, 4)
    const parent2 = makeGenome(0.9, 4)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 0 }
    })

    const [child1, child2] = GenomeModel.onePointCrossover(
      parent1,
      parent2,
      crossover
    )

    child1.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent1.chromosomes[i].color.r)
      expect(c.points).toHaveLength(parent1.chromosomes[i].points.length)
    })
    child2.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent2.chromosomes[i].color.r)
    })
  })

  test('unequal genome lengths - tail stays with original parent', () => {
    seedRandom(7)
    const parent1 = makeGenome(0.1, 5)
    const parent2 = makeGenome(0.9, 3)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 1.0 }
    })

    const [child1, child2] = GenomeModel.onePointCrossover(
      parent1,
      parent2,
      crossover
    )

    expect(child1.chromosomes).toHaveLength(5)
    expect(child2.chromosomes.length).toBeGreaterThanOrEqual(3)

    // Tail chromosomes (index 3,4) only exist in parent1
    for (let i = 3; i < child1.chromosomes.length; i++) {
      expect(child1.chromosomes[i].color.r).toBe(Math.round(0.1 * 255))
    }
  })

  test('deep clone verification - mutating child does not affect parent', () => {
    seedRandom(1)
    const parent1 = makeGenome(0.1, 3)
    const parent2 = makeGenome(0.9, 3)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 1.0 }
    })

    const originalP1R = parent1.chromosomes[0].color.r
    const originalP1X = parent1.chromosomes[0].points[0].x
    const [child1] = GenomeModel.onePointCrossover(
      parent1,
      parent2,
      crossover
    )

    // Mutate child
    child1.chromosomes[0].color.r = 999
    child1.chromosomes[0].points[0].x = 999

    // Parents unchanged
    expect(parent1.chromosomes[0].color.r).toBe(originalP1R)
    expect(parent1.chromosomes[0].points[0].x).toBe(originalP1X)
    expect(parent2.chromosomes[0].color.r).toBe(Math.round(0.9 * 255))
  })
})

// --------------------------------------------------
describe('Two-Point Crossover', () => {
  test('swaps chromosomes between two crossover points', () => {
    seedRandom(10)
    const parent1 = makeGenome(0.1, 6)
    const parent2 = makeGenome(0.9, 6)
    const crossover = new CrossoverModel({
      type: 'twoPoint',
      probabilities: { swap: 1.0 }
    })

    const [child1, child2] = GenomeModel.twoPointCrossover(
      parent1,
      parent2,
      crossover
    )

    expect(child1.chromosomes).toHaveLength(6)
    expect(child2.chromosomes).toHaveLength(6)

    const child1Colors = child1.chromosomes.map((c) => c.color.r)
    const hasP1 = child1Colors.some((r) => r === Math.round(0.1 * 255))
    const hasP2 = child1Colors.some((r) => r === Math.round(0.9 * 255))
    expect(hasP1).toBe(true)
    expect(hasP2).toBe(true)
  })

  test('no-swap returns clones of respective parents', () => {
    seedRandom(42)
    const parent1 = makeGenome(0.1, 4)
    const parent2 = makeGenome(0.9, 4)
    const crossover = new CrossoverModel({
      type: 'twoPoint',
      probabilities: { swap: 0 }
    })

    const [child1, child2] = GenomeModel.twoPointCrossover(
      parent1,
      parent2,
      crossover
    )

    child1.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent1.chromosomes[i].color.r)
    })
    child2.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent2.chromosomes[i].color.r)
    })
  })

  test('unequal genome lengths', () => {
    seedRandom(5)
    const parent1 = makeGenome(0.1, 5)
    const parent2 = makeGenome(0.9, 3)
    const crossover = new CrossoverModel({
      type: 'twoPoint',
      probabilities: { swap: 1.0 }
    })

    const [child1, child2] = GenomeModel.twoPointCrossover(
      parent1,
      parent2,
      crossover
    )

    expect(child1.chromosomes).toHaveLength(5)
    expect(child2.chromosomes.length).toBeGreaterThanOrEqual(3)
  })
})

// --------------------------------------------------
describe('Uniform Crossover', () => {
  test('swaps chromosomes independently per position', () => {
    seedRandom(10)
    const parent1 = makeGenome(0.1, 6)
    const parent2 = makeGenome(0.9, 6)
    const crossover = new CrossoverModel({
      type: 'uniform',
      probabilities: { swap: 0.5 }
    })

    const [child1, child2] = GenomeModel.uniformCrossover(
      parent1,
      parent2,
      crossover
    )

    expect(child1.chromosomes).toHaveLength(6)
    expect(child2.chromosomes).toHaveLength(6)

    child1.chromosomes.forEach((c) => {
      expect(c.points).toBeDefined()
      expect(c.color).toBeDefined()
    })
  })

  test('swap=1.0 swaps all positions within minLength', () => {
    seedRandom(10)
    const parent1 = makeGenome(0.1, 4)
    const parent2 = makeGenome(0.9, 4)
    const crossover = new CrossoverModel({
      type: 'uniform',
      probabilities: { swap: 1.0 }
    })

    const [child1, child2] = GenomeModel.uniformCrossover(
      parent1,
      parent2,
      crossover
    )

    child1.chromosomes.forEach((c) => {
      expect(c.color.r).toBe(Math.round(0.9 * 255))
    })
    child2.chromosomes.forEach((c) => {
      expect(c.color.r).toBe(Math.round(0.1 * 255))
    })
  })

  test('no-swap returns clones of respective parents', () => {
    seedRandom(42)
    const parent1 = makeGenome(0.1, 4)
    const parent2 = makeGenome(0.9, 4)
    const crossover = new CrossoverModel({
      type: 'uniform',
      probabilities: { swap: 0 }
    })

    const [child1, child2] = GenomeModel.uniformCrossover(
      parent1,
      parent2,
      crossover
    )

    child1.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent1.chromosomes[i].color.r)
    })
    child2.chromosomes.forEach((c, i) => {
      expect(c.color.r).toBe(parent2.chromosomes[i].color.r)
    })
  })

  test('deep clone verification', () => {
    seedRandom(1)
    const parent1 = makeGenome(0.1, 3)
    const parent2 = makeGenome(0.9, 3)
    const crossover = new CrossoverModel({
      type: 'uniform',
      probabilities: { swap: 1.0 }
    })

    const originalP2R = parent2.chromosomes[0].color.r
    const [child1] = GenomeModel.uniformCrossover(parent1, parent2, crossover)

    child1.chromosomes[0].color.r = 999
    expect(parent2.chromosomes[0].color.r).toBe(originalP2R)
  })
})

// --------------------------------------------------
describe('GenomeModel.crossover dispatcher', () => {
  test('dispatches to correct crossover function', () => {
    seedRandom(42)
    const parent1 = makeGenome(0.1, 3)
    const parent2 = makeGenome(0.9, 3)

    for (const type of ['onePoint', 'twoPoint', 'uniform'] as const) {
      const crossover = new CrossoverModel({
        type,
        probabilities: { swap: 0.5 }
      })
      const result = GenomeModel.crossover(parent1, parent2, crossover)
      expect(result).toHaveLength(2)
      expect(result[0].chromosomes).toBeDefined()
      expect(result[1].chromosomes).toBeDefined()
    }
  })
})
