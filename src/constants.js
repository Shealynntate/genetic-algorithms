export const SimulationState = {
  NONE: 'NONE',
  RUNNING: 'RUNNING',
  RUNNING_EXPERIMENTS: 'RUNNING_EXPERIMENTS',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE',
  COMPLETE_EXPERIMENTS: 'COMPLETE_EXPERIMENTS',
};

export const primaryButtonLabels = {
  [SimulationState.NONE]: 'Run',
  [SimulationState.RUNNING]: 'Pause',
  [SimulationState.PAUSED]: 'Resume',
  [SimulationState.COMPLETE]: 'Reset',
};

export const statusLabels = {
  [SimulationState.NONE]: 'None',
  [SimulationState.RUNNING]: 'Running',
  [SimulationState.PAUSED]: 'Paused',
  [SimulationState.COMPLETE]: 'Complete',
};

export const SelectionType = {
  ROULETTE: 'ROULETTE',
  TOURNAMENT: 'TOURNAMENT',
  SUS: 'SUS',
};

export const SelectionTypeLabels = {
  [SelectionType.ROULETTE]: 'Roulette',
  [SelectionType.TOURNAMENT]: 'Tournament',
  [SelectionType.SUS]: 'SUS',
};

export const CrossoverType = {
  ONE_POINT: 'ONE_POINT',
  TWO_POINT: 'TWO_POINT',
  UNIFORM: 'UNIFORM',
};

export const MutationProbabilityTypes = {
  TWEAK: 'TWEAK',
  ADD_POINT: 'ADD_POINT',
  REMOVE_POINT: 'REMOVE_POINT',
  ADD_CHROMOSOME: 'ADD_CHROMOSOME',
  REMOVE_CHROMOSOME: 'REMOVE_CHROMOSOME',
  RESET_CHROMOSOME: 'RESET_CHROMOSOME',
  PERMUTE_CHROMOSOMES: 'PERMUTE_CHROMOSOMES',
};

export const MutationProbabilityLabels = {
  [MutationProbabilityTypes.TWEAK]: 'Tweak',
  [MutationProbabilityTypes.ADD_POINT]: 'Add Point',
  [MutationProbabilityTypes.REMOVE_POINT]: 'Remove Point',
  [MutationProbabilityTypes.ADD_CHROMOSOME]: 'Add Chromosome',
  [MutationProbabilityTypes.REMOVE_CHROMOSOME]: 'Remove Chromosome',
  [MutationProbabilityTypes.RESET_CHROMOSOME]: 'Reset Chromosome',
  [MutationProbabilityTypes.PERMUTE_CHROMOSOMES]: 'Permute Chromosomes',
};

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
