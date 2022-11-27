export const SimulationState = {
  NONE: 'NONE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE',
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
  TOURNAMENT_ELITE: 'TOURNAMENT_ELITE',
};

export const maxPopulationSize = 1e3;

export const minPopulationSize = 2;

export const populationStepSize = 2;

export const minMutationRate = 0;

export const maxMutationRate = 1;

export const mutationRateStep = 0.01;

export const minTriangleCount = 2;

export const maxTriangleCount = 100;

export const triangleStepSize = 1;

export const targetFitness = 1;

export const maxColorValue = 255;

// ------------------------------------------------------------
export const treeParameters = {
  columns: 30,
  spacing: 10,
  padding: 10,
  radius: 3,
  genHeight: 150,
};

export const canvasParameters = {
  width: 150,
  height: 150,
};

// ------------------------------------------------------------
export const AlertState = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
};
