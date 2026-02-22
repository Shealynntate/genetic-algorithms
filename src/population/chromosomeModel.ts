import { clamp } from 'lodash'

import type MutationModel from './mutationModel'
import {
  type Chromosome,
  type ChromosomeParameters,
  type Color,
  type Point
} from './types'
import { setSigFigs } from '../common/utils'
import { maxColorValue, statsSigFigs } from '../simulation/config'
import GaussianNoise from '../utils/gaussianNoise'
import { randomFloat, randomIndex, randomInt } from '../utils/statsUtils'

const Model = {
  normalDist: new GaussianNoise(0.5, 0.25),

  // Creation Methods
  // ------------------------------------------------------------
  create: ({ numSides }: ChromosomeParameters): Chromosome => {
    const origin = Model.randomPoint()
    const color = Model.randomColor()
    const points: Point[] = []
    for (let i = 0; i < numSides; i++) {
      points.push({
        x: setSigFigs(origin.x + randomFloat(-0.1, 0.1), statsSigFigs),
        y: setSigFigs(origin.y + randomFloat(-0.1, 0.1), statsSigFigs)
      })
    }
    return { points, color }
  },

  clone: (chromosome: Chromosome): Chromosome => ({
    points: chromosome.points.map((p) => ({ ...p })),
    color: { ...chromosome.color }
  }),

  // Mutation Methods
  // ------------------------------------------------------------
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
        chromosome.points[i].x = clamp(
          setSigFigs(
            chromosome.points[i].x + mutation.pointNudge(),
            statsSigFigs
          ),
          0,
          1
        )
        chromosome.points[i].y = clamp(
          setSigFigs(
            chromosome.points[i].y + mutation.pointNudge(),
            statsSigFigs
          ),
          0,
          1
        )
      }
    }
    return chromosome
  },

  addPointMutation: (chromosome: Chromosome, maxNumPoints: number) => {
    if (chromosome.points.length >= maxNumPoints) {
      return false
    }
    const index = randomIndex(chromosome.points.length - 1)
    const a = chromosome.points[index]
    const b = chromosome.points[index + 1]
    const midpoint = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    }
    chromosome.points.splice(index + 1, 0, midpoint)
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

  tweakColor: (m: MutationModel, value: number): number =>
    clamp(
      Math.round(value + m.colorNudge() * maxColorValue),
      0,
      maxColorValue
    ),

  tweakAlpha: (m: MutationModel, value: number): number =>
    clamp(setSigFigs(value + m.colorNudge(), statsSigFigs), 0, 1),

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
