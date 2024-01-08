import ChromosomeIcon from '../common/ChromosomeIcon';
import {
  AppState,
  CrossoverType,
  DistributionTypes,
  ProbabilityTypes,
  SelectionType,
} from './typeDefinitions';

export const ParameterLabels = {
  population: {
    size: {
      text: 'Size',
      tooltip: 'How many organisms are in the population',
    },
    minPolygons: {
      text: 'Min △',
      tooltip: 'Min number of chromosomes (polygons) an organism can have',
    },
    maxPolygons: {
      text: 'Max △',
      tooltip: 'Max number of chromosomes (polygons) an organism can have',
    },
    minPoints: {
      text: 'Min Sides',
      tooltip: 'Min number of points a chromosome (polygon) can have',
    },
    maxPoints: {
      text: 'Max Sides',
      tooltip: 'Max number of points a chromosome (polygon) can have',
    },
    target: {
      text: 'Target Image',
      tooltip: 'Drag n\' drop a new target image here',
    },
  },
  selection: {
    type: {
      text: 'Type',
    },
    eliteCount: {
      text: 'Elite Count',
    },
    tournamentSize: {
      text: 'Tourney Size',
    },
  },
  crossover: {
    type: {
      text: 'Type',
    },
    probabilities: {
      [ProbabilityTypes.SWAP]: {
        text: 'Swap',
      },
    },
  },
  mutation: {
    isSinglePoint: {
      text: 'Single Point',
      tooltip: 'Should tweak mutations apply\nonce per gene or should each\npoint and color have a uniform\nchance of being tweaked',
    },
    [DistributionTypes.COLOR_SIGMA]: {
      text: 'Color',
      tooltip: 'How far a color channel (rgba) can get nudged',
    },
    [DistributionTypes.POINT_SIGMA]: {
      text: 'Point',
      tooltip: 'How far a point (x,y) can get nudged',
    },
    [DistributionTypes.PERMUTE_SIGMA]: {
      text: 'Permute',
      tooltip: 'How many chromosomes can swap their order at a time',
    },
    probabilities: {
      [ProbabilityTypes.TWEAK]: {
        text: 'Tweak',
        tooltip: 'Chance of tweaking a single property (color or point) of a polygon',
      },
      [ProbabilityTypes.TWEAK_COLOR]: {
        text: 'Color',
        tooltip: 'Chance of nudging the rgba channels of a polygon',
      },
      [ProbabilityTypes.TWEAK_POINT]: {
        text: 'Point',
        tooltip: 'Chance of nudging the (x,y) values of a point',
      },
      [ProbabilityTypes.ADD_POINT]: {
        text: 'Point +',
        tooltip: 'Chance of adding a (x,y) point to a polygon',
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        text: 'Point -',
        tooltip: 'Chance of removing a (x,y) point from a polygon',
      },
      [ProbabilityTypes.ADD_CHROMOSOME]: {
        text: 'Add',
        Icon: ChromosomeIcon,
        tooltip: 'Chance of adding a new chromosome',
      },
      [ProbabilityTypes.REMOVE_CHROMOSOME]: {
        text: 'Remove',
        Icon: ChromosomeIcon,
        tooltip: 'Chance of removing an existing chromosome',
      },
      [ProbabilityTypes.RESET_CHROMOSOME]: {
        text: 'Reset',
        Icon: ChromosomeIcon,
        tooltip: 'Chance of resetting a chromosome \n with a new random color and points',
      },
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        text: 'Permute',
        Icon: ChromosomeIcon,
        tooltip: 'Chance of swapping the order of chromosomes in an organism',
      },
    },
  },
  stopCriteria: {
    targetFitness: {
      text: 'Target Fitness',
    },
    maxGenerations: {
      text: 'Max Generations',
    },
  },
};

export const SimulationGraph = {
  title: 'Simulation vs Generations',
  minCheckbox: 'Min',
  meanCheckbox: 'Mean',
  deviationCheckbox: 'Deviation',
};

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
