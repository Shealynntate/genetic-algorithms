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

// Type Labels
// --------------------------------------------------
export const SelectionTypeLabels = {
  [SelectionType.ROULETTE]: 'Roulette',
  [SelectionType.TOURNAMENT]: 'Tournament',
  [SelectionType.SUS]: 'SUS',
};

export const CrossoverTypeLabels = {
  [CrossoverType.ONE_POINT]: 'One Point',
  [CrossoverType.TWO_POINT]: 'Two Point',
  [CrossoverType.UNIFORM]: 'Uniform',
};

export const DistSigmaLabels = {
  [DistributionTypes.COLOR_SIGMA]: 'Color',
  [DistributionTypes.POINT_SIGMA]: 'Points',
  [DistributionTypes.PERMUTE_SIGMA]: 'Permute',
};

export const ProbabilityLabels = {
  [ProbabilityTypes.TWEAK_COLOR]: 'Tweak Color',
  [ProbabilityTypes.TWEAK_POINT]: 'Tweak Point',
  [ProbabilityTypes.ADD_POINT]: 'Add Point',
  [ProbabilityTypes.REMOVE_POINT]: 'Remove Point',
  [ProbabilityTypes.ADD_CHROMOSOME]: 'Add Chromosome',
  [ProbabilityTypes.REMOVE_CHROMOSOME]: 'Remove Chromosome',
  [ProbabilityTypes.RESET_CHROMOSOME]: 'Reset Chromosome',
  [ProbabilityTypes.PERMUTE_CHROMOSOMES]: 'Permute Chromosomes',
  [ProbabilityTypes.SWAP]: 'Swap',
};

export const primaryButtonLabels = {
  [AppState.NONE]: 'Run',
  [AppState.RUNNING]: 'Pause',
  [AppState.PAUSED]: 'Resume',
  [AppState.COMPLETE]: 'Run',
};

export const statusLabels = {
  [AppState.NONE]: 'None',
  [AppState.RUNNING]: 'Running',
  [AppState.PAUSED]: 'Paused',
  [AppState.COMPLETE]: 'Complete',
};

// --------------------------------------------------
export const populationBounds = {
  max: 500,
  min: 2,
  step: 2,
};

export const eliteCountBounds = {
  min: 0,
  step: 2,
};

export const mutationBounds = {
  min: 0,
  max: 0.5,
  step: 0.001,
};

export const triangleBounds = {
  min: 2,
  max: 100,
  step: 1,
};

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
