import { maxGenerations } from '../parameters/config'

export const statsSigFigs = 4

export const minResultsThreshold = 0.90

export const saveThresholds = [
  { threshold: 60, mod: 20 },
  { threshold: 100, mod: 50 },
  { threshold: 300, mod: 100 },
  { threshold: 1_000, mod: 200 },
  { threshold: 5_000, mod: 500 },
  { threshold: 10_000, mod: 1_000 },
  { threshold: 50_000, mod: 5_000 },
  { threshold: maxGenerations, mod: 10_000 }
]
