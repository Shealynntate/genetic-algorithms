import { clamp } from 'lodash'
import { maxColorValue } from '../constants/constants'
import { randomInt, rand } from '../utils/statsUtils'
import { genRange } from '../utils/utils'
import type MutationModel from './mutationModel'

// Chromosome Initialization Helpers
// ------------------------------------------------------------
export const randCV = (): number => randomInt(0, maxColorValue)

export const randomColor = (): number[] => [randCV(), randCV(), randCV(), rand()]

export const transparent = (): number[] => [randCV(), randCV(), randCV(), 0]

export const randomPoint = (): number[] => [rand(), rand()]

export const randomPoints = (len: number): number[][] => genRange(len).map(() => randomPoint())

// Chromosome Mutation Helpers
// ------------------------------------------------------------
export const tweakPoint = (m: MutationModel, x: number, y: number): number[] => (
  [clamp(x + m.pointNudge(), 0, 1), clamp(y + m.pointNudge(), 0, 1)]
)

export const tweakColor = (m: MutationModel, value: number): number => (
  clamp(value + m.colorNudge() * maxColorValue, 0, maxColorValue)
)

export const tweakAlpha = (m: MutationModel, value: number): number => clamp(value + m.colorNudge(), 0, 1)

// Mutate a single color value
export const mutateColor = (color: number[], index: number, mutation: MutationModel): number[] => {
  if (index === 3) color[index] = tweakAlpha(mutation, color[index])
  else color[index] = tweakColor(mutation, color[index])

  return color
}

// Mutate a single (x, y) point
export const mutatePoint = (points: number[][], index: number, mutation: MutationModel): number[][] => {
  points[index] = tweakPoint(mutation, points[index][0], points[index][1])
  return points
}
