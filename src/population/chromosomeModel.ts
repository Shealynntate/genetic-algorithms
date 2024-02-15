import { type Chromosome, type ChromosomeParameters, type Color, type Point } from './types'
import type MutationModel from './mutationModel'
import { randomFloat, randomIndex, randomInt } from '../utils/statsUtils'
import { genRange, setSigFigs } from '../common/utils'
import { maxColorValue, statsSigFigs } from '../simulation/config'
import { clamp } from 'lodash'
import GaussianNoise from '../utils/gaussianNoise'

/**
 * Chromosome Model
 */
const Model = {
  normalDist: new GaussianNoise(0.5, 0.25),

  create: ({ numSides }: ChromosomeParameters): Chromosome => {
    const origin = Model.randomPoint()
    const points: Point[] = []
    // Generate points around the origin to form our polygon
    genRange(numSides).forEach(() => {
      const p = {
        x: setSigFigs(origin.x + randomFloat(-0.1, 0.1), statsSigFigs),
        y: setSigFigs(origin.y + randomFloat(-0.1, 0.1), statsSigFigs)
      }
      points.push(p)
    })
    return {
      points,
      color: Model.randomColor()
    }
  },

  clone: (chromosome: Chromosome): Chromosome => ({
    points: chromosome.points.map(p => ({ ...p })),
    color: {
      r: chromosome.color.r,
      g: chromosome.color.g,
      b: chromosome.color.b,
      a: chromosome.color.a
    }
  }),

  tweakMutation: (chromosome: Chromosome, mutation: MutationModel) => {
    if (mutation.doTweakColor()) {
      chromosome.color.r = Model.tweakColor(mutation, chromosome.color.r)
    }
    if (mutation.doTweakColor()) {
      chromosome.color.g = Model.tweakColor(mutation, chromosome.color.g)
    }
    if (mutation.doTweakColor()) {
      chromosome.color.b = Model.tweakColor(mutation, chromosome.color.b)
    }
    if (mutation.doTweakColor()) {
      chromosome.color.a = Model.tweakAlpha(mutation, chromosome.color.a)
    }
    for (let i = 0; i < chromosome.points.length; ++i) {
      if (mutation.doTweakPoint()) {
        chromosome.points[i] = Model.tweakPoint(mutation, chromosome.points[i])
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
    const x = (a.x + b.x) / 2
    const y = (a.y + b.y) / 2
    chromosome.points.splice(index + 1, 0, { x, y })

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
  tweakPoint: (m: MutationModel, p: Point): Point => ({
    x: clamp(setSigFigs(p.x + m.pointNudge(), statsSigFigs), 0, 1),
    y: clamp(setSigFigs(p.y + m.pointNudge(), statsSigFigs), 0, 1)
  }),

  tweakColor: (m: MutationModel, value: number): number => (
    clamp(Math.round(value + m.colorNudge() * maxColorValue), 0, maxColorValue)
  ),

  tweakAlpha: (m: MutationModel, value: number): number => (
    clamp(setSigFigs(value + m.colorNudge(), statsSigFigs), 0, 1)
  ),

  // Initialization Methods
  // ------------------------------------------------------------
  randCV: (): number => randomInt(0, maxColorValue),

  randomPoint: (): Point => ({
    x: Model.normalDist.next(),
    y: Model.normalDist.next()
  }),

  randomColor: (): Color => ({
    r: Model.randCV(),
    g: Model.randCV(),
    b: Model.randCV(),
    a: randomFloat(0, 1)
  })
}

export default Model
