import theme from './theme';

// Type Definitions
// --------------------------------------------------
export const SelectionType = {
  ROULETTE: 'ROULETTE',
  TOURNAMENT: 'TOURNAMENT',
  SUS: 'SUS',
};

export const CrossoverType = {
  ONE_POINT: 'ONE_POINT',
  TWO_POINT: 'TWO_POINT',
  UNIFORM: 'UNIFORM',
};

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
  SWAP: 'SWAP',
};

export const DistributionTypes = {
  // Mutation Distribution Parameters
  COLOR_SIGMA: 'COLOR_SIGMA',
  POINT_SIGMA: 'POINT_SIGMA',
  PERMUTE_SIGMA: 'PERMUTE_SIGMA',
};

export const MutationProbabilities = [
  ProbabilityTypes.TWEAK,
  ProbabilityTypes.TWEAK_POINT,
  ProbabilityTypes.TWEAK_COLOR,
  ProbabilityTypes.ADD_POINT,
  ProbabilityTypes.REMOVE_POINT,
  ProbabilityTypes.ADD_CHROMOSOME,
  ProbabilityTypes.REMOVE_CHROMOSOME,
  ProbabilityTypes.RESET_CHROMOSOME,
  ProbabilityTypes.PERMUTE_CHROMOSOMES,
];

export const CrossoverProbabilities = [
  ProbabilityTypes.SWAP,
];

export const AppState = {
  NONE: 'NONE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE',
};

export const SettingsDisabledStates = [
  AppState.RUNNING,
  AppState.PAUSED,
  AppState.COMPLETE,
];

export const SaveAppStates = [
  AppState.PAUSED,
  AppState.COMPLETE,
];

export const RunningStates = [
  AppState.RUNNING,
];

export const PausedStates = [
  AppState.PAUSED,
];

// --------------------------------------------------
export const targetFitness = 1;

export const statsSigFigs = 5;

export const workerBatchSize = 40;

export const minResultsThreshold = 0.90;

// ------------------------------------------------------------
export const maxColorValue = 255;

export const numColorChannels = 4;

export const canvasParameters = {
  width: 200,
  height: 200,
};

// ------------------------------------------------------------
export const AlertState = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
};

// Set in Database
export const SimulationStatus = {
  UNKNOWN: 'UNKNOWN',
  PENDING: 'PENDING', // Created simulations waiting to be run or deleted
  RUNNING: 'RUNNING', // Only one simuation is actively running at a time
  COMPLETE: 'COMPLETE', // Simulation has reached one of the stop criteria
};

export const defaultLineColor = theme.palette.primary.main;

export const lineColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
  theme.palette.warning.main,
  theme.palette.info.main,
  theme.palette.success.main,

  theme.palette.primary.light,
  theme.palette.secondary.light,
  theme.palette.error.light,
  theme.palette.warning.light,
  theme.palette.info.light,
  theme.palette.success.light,

  theme.palette.primary.dark,
  theme.palette.secondary.dark,
  theme.palette.error.dark,
  theme.palette.warning.dark,
  theme.palette.info.dark,
  theme.palette.success.dark,
];

export const projectUrl = 'https://github.com/Shealynntate/genetic-algorithms';
