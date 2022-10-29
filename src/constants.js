import PropTypes from 'prop-types';

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

export const OrganismNodeType = {
  id: PropTypes.number,
  fitness: PropTypes.number,
  parentA: PropTypes.number,
  parentB: PropTypes.number,
  offspringCount: PropTypes.number,
};

export const GenerationNodeType = {
  id: PropTypes.number,
  meanFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)),
};
