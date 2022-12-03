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
  SUS: 'SUS',
};

export const SelectionTypeLabels = {
  [SelectionType.ROULETTE]: 'Roulette',
  [SelectionType.TOURNAMENT]: 'Tournament',
  [SelectionType.SUS]: 'SUS',
};

export const populationBounds = {
  max: 1e3,
  min: 2,
  step: 2,
};

export const eliteCountBounds = {
  min: 0,
  step: 2,
};

export const mutationBounds = {
  min: 0.001,
  max: 1,
  step: 0.001,
};

export const triangleBounds = {
  min: 2,
  max: 100,
  step: 1,
};

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
