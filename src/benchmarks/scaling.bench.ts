import { bench, describe, beforeEach, afterAll } from 'vitest'

import {
  setupBenchmark,
  teardownBenchmark,
  createBenchmarkPopulation
} from './setup'
import type PopulationModel from '../population/populationModel'

describe('scaling: population size', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  for (const size of [50, 100, 200, 500]) {
    bench(`full generation — pop ${size}`, async () => {
      setupBenchmark()
      const population: PopulationModel = await createBenchmarkPopulation({
        size
      })
      await population.runGeneration()
    })
  }
})

describe('scaling: genome size (chromosomes per organism)', () => {
  afterAll(() => {
    teardownBenchmark()
  })

  for (const genomeSize of [5, 10, 20, 50]) {
    bench(`full generation — ${genomeSize} chromosomes`, async () => {
      setupBenchmark()
      const population: PopulationModel = await createBenchmarkPopulation({
        minGenomeSize: genomeSize,
        maxGenomeSize: genomeSize
      })
      await population.runGeneration()
    })
  }
})

describe('scaling: selection + reproduction only', () => {
  let population: PopulationModel

  afterAll(() => {
    teardownBenchmark()
  })

  for (const size of [50, 100, 200, 500]) {
    bench(`selection + reproduction — pop ${size}`, async () => {
      setupBenchmark()
      population = await createBenchmarkPopulation({ size })
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
  }
})
