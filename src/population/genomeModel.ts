import { type GenomeBounds, type Chromosome, type Genome, type GenomeParameters } from './types'
import type CrossoverModel from './crossoverModel'
import type MutationModel from './mutationModel'
import { genRange } from '../utils/utils'
import { randomIndex } from '../utils/statsUtils'
import ChromosomeModel from './chromosomeModel'

const GenomeModel = {
  // Creation Methods
  // ------------------------------------------------------------
  create: ({ size, numSides }: GenomeParameters): Genome => ({
    chromosomes: genRange(size).map(() => ChromosomeModel.create({ numSides }))
  }),

  clone: (genome: Genome): Genome => ({
    chromosomes: genome.chromosomes.map((d) => ChromosomeModel.clone(d))
  }),

  // Crossover Methods
  // ------------------------------------------------------------
  crossover: (parent1: Genome, parent2: Genome, crossover: CrossoverModel): Genome[] => {
    let func
    switch (crossover.type) {
      case 'onePoint':
        func = GenomeModel.onePointCrossover
        break
      case 'twoPoint':
        func = GenomeModel.twoPointCrossover
        break
      case 'uniform':
        func = GenomeModel.uniformCrossover
        break
    }
    return func(parent1, parent2, crossover)
  },

  onePointCrossover: (parent1: Genome, parent2: Genome, crossover: CrossoverModel): Genome[] => {
    const child1: Chromosome[] = []
    const child2: Chromosome[] = []
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.chromosomes.length, parent2.chromosomes.length)
    const maxLength = Math.max(parent1.chromosomes.length, parent2.chromosomes.length)
    // Choose a crossover index using the shorter of the two parents' lengths
    const index = crossover.doCrossover() ? randomIndex(minLength) : -1

    genRange(maxLength).forEach((i) => {
      if (index >= 0 && i <= index) {
        // Perform a crossover event
        child1.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        child2.push(ChromosomeModel.clone(parent1.chromosomes[i]))
      } else {
        if (i < parent1.chromosomes.length) {
          child1.push(ChromosomeModel.clone(parent1.chromosomes[i]))
        }
        if (i < parent2.chromosomes.length) {
          child2.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        }
      }
    })

    return [{ chromosomes: child1 }, { chromosomes: child2 }]
  },

  twoPointCrossover: (parent1: Genome, parent2: Genome, crossover: CrossoverModel): Genome[] => {
    const child1: Chromosome[] = []
    const child2: Chromosome[] = []
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.chromosomes.length, parent2.chromosomes.length)
    const maxLength = Math.max(parent1.chromosomes.length, parent2.chromosomes.length)
    const doCrossover = crossover.doCrossover()
    // Choose a crossover indices using the shorter of the two parents' lengths
    let index1 = doCrossover ? randomIndex(minLength) : -1
    let index2 = doCrossover ? randomIndex(minLength) : -1
    if (index2 < index1) {
      // Swap so index1 is always smaller than index2
      const temp = index1
      index1 = index2
      index2 = temp
    }
    genRange(maxLength).forEach((i) => {
      if (i >= index1 && i <= index2) {
        // Perform a crossover event
        child1.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        child2.push(ChromosomeModel.clone(parent1.chromosomes[i]))
      } else {
        if (i < parent1.chromosomes.length) {
          child1.push(ChromosomeModel.clone(parent1.chromosomes[i]))
        }
        if (i < parent2.chromosomes.length) {
          child2.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        }
      }
    })

    return [{ chromosomes: child1 }, { chromosomes: child2 }]
  },

  uniformCrossover: (parent1: Genome, parent2: Genome, crossover: CrossoverModel): Genome[] => {
    const child1: Chromosome[] = []
    const child2: Chromosome[] = []
    // Check if the parents have different length genomes
    const minLength = Math.min(parent1.chromosomes.length, parent2.chromosomes.length)
    const maxLength = Math.max(parent1.chromosomes.length, parent2.chromosomes.length)

    genRange(maxLength).forEach((i) => {
      if (i < minLength && crossover.doCrossover()) {
        // Perform a crossover event
        child1.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        child2.push(ChromosomeModel.clone(parent1.chromosomes[i]))
      } else {
        if (i < parent1.chromosomes.length) {
          child1.push(ChromosomeModel.clone(parent1.chromosomes[i]))
        }
        if (i < parent2.chromosomes.length) {
          child2.push(ChromosomeModel.clone(parent2.chromosomes[i]))
        }
      }
    })

    return [{ chromosomes: child1 }, { chromosomes: child2 }]
  },

  // Mutation Methods
  // ------------------------------------------------------------
  mutate: (genome: Genome, mutation: MutationModel, bounds: GenomeBounds) => {
    const { maxPoints, minPoints, maxGenomeSize } = bounds
    const { chromosomes } = genome
    // Mutate at the genome level

    // Check add chromosome mutation
    if (chromosomes.length < maxGenomeSize && mutation.doAddChromosome()) {
      chromosomes.push(ChromosomeModel.create({ numSides: minPoints }))
    }

    // Check remove chromosome mutation
    if (chromosomes.length > 1 && mutation.doRemoveChromosome()) {
      // Delete the chromosome
      const index = randomIndex(chromosomes.length)
      chromosomes.splice(index, 1)
    }

    // Mutate Genome
    if (mutation.doPermute()) {
      GenomeModel.mutateOrder(genome, mutation)
    }

    // Mutate at the chromosome level
    for (let i = 0; i < chromosomes.length; ++i) {
      // Check add point mutation
      if (mutation.doAddPoint()) {
        ChromosomeModel.addPointMutation(chromosomes[i], maxPoints)
      }
      // Check remove point mutation
      if (mutation.doRemovePoint()) {
        ChromosomeModel.removePointMutation(chromosomes[i], minPoints)
      }
      // Check tweak values mutation
      chromosomes[i] = ChromosomeModel.tweakMutation(chromosomes[i], mutation)
    }
  },

  // Swap a random range of adjacent Chromosome objects in the array
  mutateOrder: (genome: Genome, mutation: MutationModel) => {
    const index = randomIndex(genome.chromosomes.length - 1)
    const chromosome = genome.chromosomes.splice(index, 1)[0]
    // Insert it in a new location
    const newIndex = randomIndex(genome.chromosomes.length)
    genome.chromosomes.splice(newIndex, 0, chromosome)
  }
}

export default GenomeModel
