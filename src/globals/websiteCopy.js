import ChromosomeIcon from '../components/ChromosomeIcon';
import { DistributionTypes, ProbabilityTypes } from '../constants';

// eslint-disable-next-line import/prefer-default-export
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
      [ProbabilityTypes.TWEAK_COLOR]: {
        text: 'Tweak Color',
      },
      [ProbabilityTypes.TWEAK_POINT]: {
        text: 'Tweak Point',
      },
      [ProbabilityTypes.ADD_POINT]: {
        text: 'Add Point',
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        text: 'Remove Point',
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
        tooltip: 'Chance of resetting a chromosome with a new random color and points',
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
