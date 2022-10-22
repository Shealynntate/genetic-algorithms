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

export const maxPopulationSize = 1e3;

export const minPopulationSize = 2;

export const minMutationRate = 0;

export const maxMutationRate = 1;

export const mutationRateStep = 0.01;
