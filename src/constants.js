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

// Types
// ------------------------------------------------------------
export const OrganismType = {
  id: PropTypes.number,
  parentA: PropTypes.number,
  parentB: PropTypes.number,
  genome: PropTypes.string,
  fitness: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.number),
};

export const GenerationType = {
  id: PropTypes.number,
  meanFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismType)),
};

export const OrganismNodeType = {
  id: PropTypes.number,
  genome: PropTypes.string,
  fitness: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

OrganismNodeType.parentA = PropTypes.shape(OrganismNodeType);
OrganismNodeType.parentB = PropTypes.shape(OrganismNodeType);
OrganismNodeType.children = PropTypes.arrayOf(PropTypes.OrganismNodeType);

export const GenerationNodeType = {
  id: PropTypes.number,
  meanFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)),
};

export const treeParameters = {
  columns: 30,
  rows: 10,
  spacing: 10,
  padding: 10,
  radius: 3,
};
