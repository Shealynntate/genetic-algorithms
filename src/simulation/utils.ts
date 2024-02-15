import {
  call,
  select,
  type GetContextEffect,
  type SelectEffect,
  getContext,
  type CallEffect,
  type SagaReturnType,
  take,
  type TakeEffect
} from 'redux-saga/effects'
import { approxEqual } from '../common/utils'
import { addGifEntry, getCurrentImages, getCurrentSimulation } from '../database/api'
import { saveThresholds } from '../simulation/config'
import { createGif, genomeToPhenotype } from '../utils/imageUtils'
import { type OrganismRecord } from './types'
import { type RootState } from '../store'

export const shouldSaveGenImage = (genId: number): boolean => {
  for (let i = 0; i < saveThresholds.length; ++i) {
    if (genId <= saveThresholds[i].threshold) {
      const mod = saveThresholds[i].mod

      return (genId % mod) === 0
    }
  }
  return false
}

/**
 * Uses the approxEqual function to determine if the simulation reached the target fitness
 * @param globalBest the best organism of the entire simulation
 * @param target the target fitness, a number between [0, 1]
 * @returns true if the global best has reached the target
 */
export const hasReachedTarget = (globalBest: OrganismRecord | undefined, target: number): boolean => {
  if (globalBest == null) return false

  const { fitness } = globalBest.organism

  return fitness > target || approxEqual(fitness, target)
}

/**
 * Create a final timelapse gif of the simulation, to be saved in the local database
 * @param globalBest the best organism of the entire simulation
 * @returns a promise that resolves when the gif has been created and saved
 */
export const createGalleryEntry = async (globalBest: OrganismRecord): Promise<void> => {
  const simulation = await getCurrentSimulation()
  if (simulation == null) {
    console.error('[createGalleryEntry] No current simulation found')
    return
  }
  const { id } = simulation
  const history = await getCurrentImages()
  const imageData = history.map((entry) => entry.imageData)
  const phenotype = genomeToPhenotype(globalBest.organism.genome)
  // Show the last image 4 times as long in the gif
  const result = [...imageData, phenotype, phenotype, phenotype, phenotype]
  const gif = await createGif(result as ImageData[])
  if (id == null) {
    throw new Error('[createGalleryEntry] No simulation id found')
  }
  await addGifEntry(id, gif)
}

export function * typedSelect<T> (selector: (state: RootState) => T): Generator<SelectEffect, T, T> {
  const slice: T = yield select(selector)

  return slice
}

export function * typedCall<Fn extends (...args: any[]) => any> (
  fn: Fn,
  ...args: Parameters<Fn>
): Generator<CallEffect<SagaReturnType<Fn>>, SagaReturnType<Fn>, SagaReturnType<Fn>> {
  const value: SagaReturnType<typeof fn> = yield call(fn, ...args)

  return value
}

export function * typedGetContext<T> (key: string): Generator<GetContextEffect, T, T> {
  const value: T = yield getContext(key)

  return value
}

export function * typedTake<T> (pattern: string): Generator<TakeEffect, T, T> {
  const action: T = yield take(pattern)

  return action
}
