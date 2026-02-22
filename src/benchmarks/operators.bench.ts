import { bench, describe, afterAll } from 'vitest'

import {
  setupBenchmark,
  teardownBenchmark,
  createBenchmarkParams,
  createOperatorModels
} from './setup'
import ChromosomeModel from '../population/chromosomeModel'
import CrossoverModel from '../population/crossoverModel'
import GenomeModel from '../population/genomeModel'
import OrganismModel from '../population/organismModel'

describe('crossover operators', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('onePoint crossover', () => {
    setupBenchmark()
    const parent1 = GenomeModel.create({ size: 20, numSides: 5 })
    const parent2 = GenomeModel.create({ size: 20, numSides: 5 })
    const crossover = new CrossoverModel({
      type: 'onePoint',
      probabilities: { swap: 0.9 }
    })
    GenomeModel.onePointCrossover(parent1, parent2, crossover)
  })

  bench('twoPoint crossover', () => {
    setupBenchmark()
    const parent1 = GenomeModel.create({ size: 20, numSides: 5 })
    const parent2 = GenomeModel.create({ size: 20, numSides: 5 })
    const crossover = new CrossoverModel({
      type: 'twoPoint',
      probabilities: { swap: 0.9 }
    })
    GenomeModel.twoPointCrossover(parent1, parent2, crossover)
  })

  bench('uniform crossover', () => {
    setupBenchmark()
    const parent1 = GenomeModel.create({ size: 20, numSides: 5 })
    const parent2 = GenomeModel.create({ size: 20, numSides: 5 })
    const crossover = new CrossoverModel({
      type: 'uniform',
      probabilities: { swap: 0.9 }
    })
    GenomeModel.uniformCrossover(parent1, parent2, crossover)
  })
})

describe('genome mutation', () => {
  const bounds = { maxGenomeSize: 50, minPoints: 3, maxPoints: 10 }

  afterAll(() => {
    teardownBenchmark()
  })

  bench('genome mutation (20 chromosomes)', () => {
    setupBenchmark()
    const genome = GenomeModel.create({ size: 20, numSides: 5 })
    const { mutation } = createOperatorModels()
    const clone = GenomeModel.clone(genome)
    GenomeModel.mutate(clone, mutation, bounds)
  })
})

describe('chromosome operations', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('chromosome create', () => {
    setupBenchmark()
    ChromosomeModel.create({ numSides: 5 })
  })

  bench('chromosome clone', () => {
    setupBenchmark()
    const c = ChromosomeModel.create({ numSides: 8 })
    ChromosomeModel.clone(c)
  })

  bench('chromosome tweak mutation', () => {
    setupBenchmark()
    const { mutation } = createOperatorModels()
    const c = ChromosomeModel.create({ numSides: 5 })
    ChromosomeModel.tweakMutation(c, mutation)
  })

  bench('chromosome add point', () => {
    setupBenchmark()
    const c = ChromosomeModel.create({ numSides: 5 })
    ChromosomeModel.addPointMutation(c, 10)
  })

  bench('chromosome remove point', () => {
    setupBenchmark()
    const c = ChromosomeModel.create({ numSides: 5 })
    ChromosomeModel.removePointMutation(c, 3)
  })
})

describe('organism operations', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('organism create', () => {
    setupBenchmark()
    OrganismModel.create({ size: 20, numSides: 5 })
  })

  bench('organism reproduce', () => {
    setupBenchmark()
    const params = createBenchmarkParams()
    const { crossover, mutation } = createOperatorModels(params)
    const a = OrganismModel.create({ size: 20, numSides: 5 })
    const b = OrganismModel.create({ size: 20, numSides: 5 })
    const bounds = {
      maxGenomeSize: params.maxGenomeSize,
      minPoints: params.minPoints,
      maxPoints: params.maxPoints
    }
    OrganismModel.reproduce(a, b, crossover, mutation, bounds)
  })
})
