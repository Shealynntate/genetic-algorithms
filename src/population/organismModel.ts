import {
  type GenomeBounds,
  type Organism,
  type OrganismParameters
} from './types'
import type CrossoverModel from './crossoverModel'
import type MutationModel from './mutationModel'
import Genome from './genomeModel'

let organismCount = -1
const nextId = (): number => {
  organismCount += 1

  return organismCount
}

const OrganismModel = {
  create: ({ id, size, numSides }: OrganismParameters) => ({
    id: id ?? nextId(),
    genome: Genome.create({ size, numSides }),
    fitness: 0
  }),

  reproduce: (
    parentA: Organism,
    parentB: Organism,
    crossover: CrossoverModel,
    mutation: MutationModel,
    bounds: GenomeBounds
  ): Organism[] => {
    // Perform Crossover
    const [newGenome1, newGenome2] = Genome.crossover(
      parentA.genome,
      parentB.genome,
      crossover
    )
    // Create the child Organisms
    const childA: Organism = { id: nextId(), genome: newGenome1, fitness: 0 }
    const childB: Organism = { id: nextId(), genome: newGenome2, fitness: 0 }
    // Mutate the new children
    Genome.mutate(childA.genome, mutation, bounds)
    Genome.mutate(childB.genome, mutation, bounds)

    return [childA, childB]
  },

  clone: (organism: Organism): Organism => {
    return {
      id: nextId(),
      genome: Genome.clone(organism.genome),
      fitness: 0
    }
  },

  cloneAndMutate: (
    organism: Organism,
    mutation: MutationModel,
    bounds: GenomeBounds
  ): Organism => {
    const copy = OrganismModel.clone(organism)
    Genome.mutate(copy.genome, mutation, bounds)
    return copy
  },

  // Organism ID Functions
  // ------------------------------------------------------------
  getLatestId: (): number => organismCount,

  reset: () => {
    organismCount = -1
  },

  // This occurs when rehydrating
  restoreId: (id: number) => {
    organismCount = id
  }
}

export default OrganismModel
