import { type Chromosome, type ChromosomeParameters } from './types'
import type MutationModel from './mutationModel'
import { rand, randomFloat, randomIndex, randomInt } from '../utils/statsUtils'
import { genRange } from '../utils/utils'
import { maxColorValue } from '../constants/constants'
import { clamp } from 'lodash'

/**
 * Chromosome Model
 */
const Model = {
  create: ({ numSides }: ChromosomeParameters): Chromosome => {
    const origin = Model.randomPoint()
    const points: number[][] = []
    // Generate points around the origin to form our polygon
    genRange(numSides).forEach(() => {
      const p = [origin[0] + randomFloat(-0.1, 0.1), origin[1] + randomFloat(-0.1, 0.1)]
      points.push(p)
    })
    return {
      points,
      color: Model.randomColor()
    }
  },

  clone: (chromosome: Chromosome): Chromosome => ({
    points: chromosome.points.slice(),
    color: chromosome.color.slice()
  }),

  tweakMutation: (chromosome: Chromosome, mutation: MutationModel) => {
    for (let i = 0; i < chromosome.color.length; ++i) {
      if (mutation.doTweakColor()) {
        if (i === 3) {
          chromosome.color[i] = Model.tweakAlpha(mutation, chromosome.color[i])
        } else {
          chromosome.color[i] = Model.tweakColor(mutation, chromosome.color[i])
        }
      }
    }
    for (let i = 0; i < chromosome.points.length; ++i) {
      if (mutation.doTweakPoint()) {
        chromosome.points[i] = Model.tweakPoint(mutation, chromosome.points[i][0], chromosome.points[i][1])
      }
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

  // Mutation Methods
  // ------------------------------------------------------------
  tweakPoint: (m: MutationModel, x: number, y: number): number[] => (
    [clamp(x + m.pointNudge(), 0, 1), clamp(y + m.pointNudge(), 0, 1)]
  ),

  tweakColor: (m: MutationModel, value: number): number => (
    clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue)
  ),

  tweakAlpha: (m: MutationModel, value: number): number => clamp(value + m.colorNudge(), 0, 1),

  // Initialization Methods
  // ------------------------------------------------------------
  randCV: (): number => randomInt(0, maxColorValue),

  randomPoint: (): number[] => [rand(), rand()],

  randomColor: (): number[] => [
    Model.randCV(),
    Model.randCV(),
    Model.randCV(),
    0
  ]
}

export default Model
