/**
 * Seedable PRNG module using mulberry32.
 *
 * By default delegates to Math.random(). Call seedRandom(n) to switch to
 * deterministic output, resetRandom() to restore Math.random().
 */

let currentRandom: () => number = Math.random

function mulberry32(seed: number): () => number {
  let s = seed | 0
  return (): number => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedRandom(seed: number): void {
  currentRandom = mulberry32(seed)
}

export function resetRandom(): void {
  currentRandom = Math.random
}

export function random(): number {
  return currentRandom()
}
