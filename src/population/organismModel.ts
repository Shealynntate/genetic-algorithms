import { type OrganismParameters } from './types'
import Genome from './genome'

let organismCount = -1
const nextId = (): number => {
  organismCount += 1
  return organismCount
}

const OrganismModel = {
  create: ({ id, size, numSides, genome }: OrganismParameters) => ({
    id: id ?? nextId(),
    genome: genome ?? Genome.create({ size, numSides }),
    fitness: 0
  }),

  reproduce: (parentA, parentB, crossover, mutation, bounds) => {
    // Perform Crossover
    const [newChromosome1, newChromosome2] = Genome.crossover(
      parentA.genome.chromosomes,
      parentB.genome.chromosomes,
      crossover
    )
    // Create the child Organisms
    const childA = Organism.create({ genome: Genome.create({ chromosomes: newChromosome1 }) })
    const childB = Organism.create({ genome: Genome.create({ chromosomes: newChromosome2 }) })
    // Mutate the new children
    Genome.mutate(childA.genome, mutation, bounds)
    Genome.mutate(childB.genome, mutation, bounds)

    return [childA, childB]
  },

  clone: (organism) => Organism.create({
    genome: Genome.clone(organism.genome)
  }),

  cloneAndMutate: (organism, mutation, bounds) => {
    const copy = Organism.clone(organism)
    Genome.mutate(copy.genome, mutation, bounds)
    return copy
  },

  // Organism ID Functions
  // ------------------------------------------------------------
  getLatestId: (): number => (organismCount),

  reset: () => {
    organismCount = -1
  },

  // This occurs when rehydrating
  restoreId: (id: number) => {
    organismCount = id
  }
}

export default OrganismModel
