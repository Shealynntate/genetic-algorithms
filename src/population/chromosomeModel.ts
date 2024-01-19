import { type Chromosome, type ChromosomeParameters } from './types'
import type MutationModel from './mutationModel'
import { randomIndex, flipCoin } from '../utils/statsUtils'
import {
  randomPoints,
  mutateColor,
  mutatePoint,
  transparent,
  tweakAlpha,
  tweakColor,
  tweakPoint
} from './chromosomeUtils'

/**
 * Chromosome
 */
const ChromosomeModel = {
  create: ({ numSides }: ChromosomeParameters): Chromosome => ({
    points: randomPoints(numSides),
    color: transparent()
  }),

  clone: (chromosome: Chromosome): Chromosome => ({
    points: chromosome.points.slice(),
    color: chromosome.color.slice()
  }),

  tweakMutationUniform: (chromosome: Chromosome, mutation: MutationModel) => {
    for (let i = 0; i < chromosome.color.length; ++i) {
      if (mutation.doTweakColor()) {
        if (i === 3) {
          chromosome.color[i] = tweakAlpha(mutation, chromosome.color[i])
        } else {
          chromosome.color[i] = tweakColor(mutation, chromosome.color[i])
        }
      }
    }
    for (let i = 0; i < chromosome.points.length; ++i) {
      if (mutation.doTweakPoint()) {
        chromosome.points[i] = tweakPoint(mutation, chromosome.points[i][0], chromosome.points[i][1])
      }
    }
    return chromosome
  },

  // Exacly 1 mutation per Chromosome
  tweakMutationSinglePoint: (chromosome: Chromosome, mutation: MutationModel) => {
    const { color, points } = chromosome
    // Flip a coin to decide between mutating a color or point,
    // there can be far more points than colors so this ensures colors get a chance to mutate
    if (flipCoin(0.25)) {
      const index = randomIndex(color.length)
      chromosome.color = mutateColor(color, index, mutation)
    } else {
      const index = randomIndex(points.length)
      chromosome.points = mutatePoint(points, index, mutation)
    }

    return chromosome
  },

  /**
   * Adds a randomly generated (x,y) point to the Chromosome if possible
   * @param {*} chromosome - an array of Chromosome objects
   * @returns true if the add mutation was successful, false if the chromosome already has the
   * maximum number of points allowed
   */
  addPointMutation: (chromosome: Chromosome, maxNumPoints: number) => {
    if (chromosome.points.length >= maxNumPoints) {
      return false
    }

    const index = randomIndex(chromosome.points.length - 1)
    const a = chromosome.points[index]
    const b = chromosome.points[index + 1]
    const x = (a[0] + b[0]) / 2
    const y = (a[1] + b[1]) / 2
    chromosome.points.splice(index + 1, 0, [x, y])

    return true
  },

  removePointMutation: (chromosome: Chromosome, minNumPoints: number) => {
    if (chromosome.points.length <= minNumPoints) {
      return false
    }
    const index = randomIndex(chromosome.points.length - 1)
    chromosome.points.splice(index, 1)

    return true
  },

  resetMutation: (chromosome: Chromosome, numPoints: number) => {
    chromosome.points = randomPoints(numPoints)
    chromosome.color = transparent()
  }
}

export default ChromosomeModel
