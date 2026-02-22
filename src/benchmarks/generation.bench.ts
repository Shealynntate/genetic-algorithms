import { bench, describe, afterAll } from 'vitest'

import {
  setupBenchmark,
  teardownBenchmark,
  createBenchmarkPopulation,
  createBenchmarkParams,
  mockFitnessEvaluator
} from './setup'
import OrganismModel from '../population/organismModel'
import PopulationModel from '../population/populationModel'

describe('generation phases', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('full generation (mock fitness)', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    await population.runGeneration()
  })

  bench('selection only (tournament)', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    population.performSelection(
      population.selection.type,
      population.selection.tournamentSize,
      population.selection.eliteCount
    )
  })

  bench('reproduction (crossover + mutation)', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    const parents = population.performSelection(
      population.selection.type,
      population.selection.tournamentSize,
      population.selection.eliteCount
    )
    population.reproduce(
      parents,
      population.selection,
      population.crossover,
      population.mutation
    )
  })

  bench('createStats', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    population.createStats()
  })
})

describe('selection methods', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('tournament selection', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    population.performSelection('tournament', 3, 2)
  })

  bench('roulette selection', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    population.performSelection('roulette', 0, 2)
  })

  bench('SUS selection', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    population.performSelection('sus', 0, 2)
  })
})

describe('fitness evaluation mock', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  bench('mock fitness evaluation (100 organisms)', async () => {
    setupBenchmark()
    const population = await createBenchmarkPopulation()
    await mockFitnessEvaluator(population.organisms)
  })
})
