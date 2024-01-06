export const SelectionType = {
  ROULETTE: 'ROULETTE',
  TOURNAMENT: 'TOURNAMENT',
  SUS: 'SUS'
}

export const CrossoverType = {
  ONE_POINT: 'ONE_POINT',
  TWO_POINT: 'TWO_POINT',
  UNIFORM: 'UNIFORM'
}

export const ProbabilityTypes = {
  // Mutation Probabilities
  TWEAK: 'TWEAK',
  TWEAK_POINT: 'TWEAK_POINT',
  TWEAK_COLOR: 'TWEAK_COLOR',
  ADD_POINT: 'ADD_POINT',
  REMOVE_POINT: 'REMOVE_POINT',
  ADD_CHROMOSOME: 'ADD_CHROMOSOME',
  REMOVE_CHROMOSOME: 'REMOVE_CHROMOSOME',
  RESET_CHROMOSOME: 'RESET_CHROMOSOME',
  PERMUTE_CHROMOSOMES: 'PERMUTE_CHROMOSOMES',
  // Crossover Probabilities
  SWAP: 'SWAP'
}

export const DistributionTypes = {
  // Mutation Distribution Parameters
  COLOR_SIGMA: 'COLOR_SIGMA',
  POINT_SIGMA: 'POINT_SIGMA',
  PERMUTE_SIGMA: 'PERMUTE_SIGMA'
}

export const AppState = {
  NONE: 'NONE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE'
}

// ------------------------------------------------------------
export const AlertState = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning'
}
