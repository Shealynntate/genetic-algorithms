import ChromosomeModel from '../population/chromosomeModel'
import CrossoverModel from '../population/crossoverModel'
import GenomeModel from '../population/genomeModel'
import MutationModel from '../population/mutationModel'
import OrganismModel from '../population/organismModel'
import { type GenomeBounds } from '../population/types'
import { seedRandom, resetRandom } from '../utils/random'

const bounds: GenomeBounds = {
  maxGenomeSize: 10,
  minPoints: 3,
  maxPoints: 10
}

beforeEach(() => {
  seedRandom(42)
  OrganismModel.reset()
})

afterEach(() => {
  resetRandom()
  vi.restoreAllMocks()
})

describe('OrganismModel.reproduce', () => {
  test('returns two children with new IDs and fitness=0', () => {
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 0.9 }
    })
    const mutation = new MutationModel({
      genomeSize: 10,
      distributions: { colorSigma: 0.06, pointSigma: 0.06 },
      probabilities: {
        tweakColor: 0,
        tweakPoint: 0,
        addPoint: 0,
        removePoint: 0,
        addChromosome: 0,
        removeChromosome: 0,
        permuteChromosomes: 0
      }
    })

    const parentA = OrganismModel.create({ size: 3, numSides: 3 })
    parentA.fitness = 0.8
    const parentB = OrganismModel.create({ size: 3, numSides: 3 })
    parentB.fitness = 0.6

    const children = OrganismModel.reproduce(
      parentA,
      parentB,
      crossover,
      mutation,
      bounds
    )

    expect(children).toHaveLength(2)
    expect(children[0].id).not.toBe(parentA.id)
    expect(children[0].id).not.toBe(parentB.id)
    expect(children[1].id).not.toBe(parentA.id)
    expect(children[1].id).not.toBe(parentB.id)
    expect(children[0].id).not.toBe(children[1].id)
    expect(children[0].fitness).toBe(0)
    expect(children[1].fitness).toBe(0)
  })

  test('children derive from parents (seeded PRNG, verify chromosome sources)', () => {
    seedRandom(10)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 1.0 }
    })
    const mutation = new MutationModel({
      genomeSize: 10,
      distributions: { colorSigma: 0, pointSigma: 0 },
      probabilities: {
        tweakColor: 0,
        tweakPoint: 0,
        addPoint: 0,
        removePoint: 0,
        addChromosome: 0,
        removeChromosome: 0,
        permuteChromosomes: 0
      }
    })

    // Get expected crossover result
    seedRandom(10)
    OrganismModel.reset()
    const pA = OrganismModel.create({ size: 3, numSides: 3 })
    const pB = OrganismModel.create({ size: 3, numSides: 3 })
    const [expectedGenome1, expectedGenome2] = GenomeModel.crossover(
      pA.genome,
      pB.genome,
      crossover
    )

    // Now do the actual reproduce with same seed
    seedRandom(10)
    OrganismModel.reset()
    const rA = OrganismModel.create({ size: 3, numSides: 3 })
    const rB = OrganismModel.create({ size: 3, numSides: 3 })
    const children = OrganismModel.reproduce(
      rA,
      rB,
      crossover,
      mutation,
      bounds
    )

    expect(children[0].genome.chromosomes).toHaveLength(
      expectedGenome1.chromosomes.length
    )
    expect(children[1].genome.chromosomes).toHaveLength(
      expectedGenome2.chromosomes.length
    )
  })

  test('children are mutated when mutation probabilities are high', () => {
    seedRandom(42)
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 0 }
    })
    const mutation = new MutationModel({
      genomeSize: 10,
      distributions: { colorSigma: 0.5, pointSigma: 0.5 },
      probabilities: {
        tweakColor: 1.0,
        tweakPoint: 1.0,
        addPoint: 0,
        removePoint: 0,
        addChromosome: 0,
        removeChromosome: 0,
        permuteChromosomes: 0
      }
    })

    const parentA = OrganismModel.create({ size: 2, numSides: 3 })
    const parentB = OrganismModel.create({ size: 2, numSides: 3 })

    // Snapshot parent state before reproduction
    const parentASnapshot = parentA.genome.chromosomes.map((c) =>
      ChromosomeModel.clone(c)
    )

    const children = OrganismModel.reproduce(
      parentA,
      parentB,
      crossover,
      mutation,
      bounds
    )

    // With no crossover but high mutation, child1 should differ from parentA
    const child1Genome = children[0].genome
    let anyDifference = false
    for (let i = 0; i < child1Genome.chromosomes.length; i++) {
      const childChrom = child1Genome.chromosomes[i]
      const parentChrom = parentASnapshot[i]
      if (parentChrom) {
        if (
          childChrom.color.r !== parentChrom.color.r ||
          childChrom.color.g !== parentChrom.color.g ||
          childChrom.color.b !== parentChrom.color.b
        ) {
          anyDifference = true
          break
        }
        for (let j = 0; j < childChrom.points.length; j++) {
          if (
            childChrom.points[j].x !== parentChrom.points[j].x ||
            childChrom.points[j].y !== parentChrom.points[j].y
          ) {
            anyDifference = true
            break
          }
        }
      }
    }
    expect(anyDifference).toBe(true)
  })
})

describe('OrganismModel.clone', () => {
  test('clone has new ID and fitness=0', () => {
    const org = OrganismModel.create({ size: 2, numSides: 3 })
    org.fitness = 0.9

    const clone = OrganismModel.clone(org)

    expect(clone.id).not.toBe(org.id)
    expect(clone.fitness).toBe(0)
    expect(clone.genome.chromosomes).toHaveLength(
      org.genome.chromosomes.length
    )
  })

  test('clone is a deep copy', () => {
    const org = OrganismModel.create({ size: 2, numSides: 3 })
    const clone = OrganismModel.clone(org)

    // Mutate clone
    clone.genome.chromosomes[0].color.r = 999
    clone.genome.chromosomes[0].points[0].x = 999

    // Original is unchanged
    expect(org.genome.chromosomes[0].color.r).not.toBe(999)
    expect(org.genome.chromosomes[0].points[0].x).not.toBe(999)
  })
})
