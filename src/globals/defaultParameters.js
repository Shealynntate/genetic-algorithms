import defaultTarget from '../assets/mona_lisa.jpeg';
import {
  CrossoverType,
  DistributionTypes,
  ProbabilityTypes,
  SelectionType,
  targetFitness,
} from '../constants';

export const ParameterBounds = {
  population: {
    size: {
      min: 2,
      max: 500,
      step: 2,
    },
  },
  selection: {},
  crossover: {},
  mutation: {},
  stopCriteria: {
    targetFitness: {
      min: 0,
      max: 1,
      step: 0.001,
    },
    maxGenerations: {
      min: 1,
      max: 100_000,
      step: 1,
    },
  },
};

export const ParameterLabels = {
  population: {
    size: 'Population Size',
    minPolygons: 'Min Polygons',
    maxPolygons: 'Max Polygons',
    target: 'Target Image',
  },
  selection: {
    type: 'Type',
    eliteCount: 'Elite Count',
    tournamentSize: 'Tournament Size',
  },
  crossover: {
    type: 'Type',
    probabilities: {
      [ProbabilityTypes.SWAP]: 'Swap',
    },
  },
  mutation: {
    [DistributionTypes.COLOR_SIGMA]: 'Color',
    [DistributionTypes.POINT_SIGMA]: 'Point',
    [DistributionTypes.PERMUTE_SIGMA]: 'Permute',
    probabilities: {
      [ProbabilityTypes.TWEAK]: 'Tweak',
      [ProbabilityTypes.ADD_POINT]: 'Add Point',
      [ProbabilityTypes.REMOVE_POINT]: 'Remove Point',
      [ProbabilityTypes.ADD_CHROMOSOME]: 'Add Chromosome',
      [ProbabilityTypes.REMOVE_CHROMOSOME]: 'Remove Chromosome',
      [ProbabilityTypes.RESET_CHROMOSOME]: 'Reset Chromosome',
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: 'Permute Chromosomes',
    },
  },
  stopCriteria: {
    targetFitness: 'Target Fitness',
    maxGenerations: 'Max Generations',
  },
};

const parameters = {
  population: {
    size: 200,
    minPolygons: 1,
    maxPolygons: 50,
    target: defaultTarget,
  },
  selection: {
    type: SelectionType.TOURNAMENT,
    eliteCount: 0,
    tournamentSize: 2,
  },
  crossover: {
    type: CrossoverType.ONE_POINT,
    probabilities: {
      [ProbabilityTypes.SWAP]: {
        startValue: 0.9,
        endValue: 0.9,
        startFitness: 0,
        endFitness: targetFitness,
      },
    },
  },
  mutation: {
    [DistributionTypes.COLOR_SIGMA]: 0.05, // 0.25 / n
    [DistributionTypes.POINT_SIGMA]: 0.05,
    [DistributionTypes.PERMUTE_SIGMA]: 0.05, // TODO
    probabilities: {
      [ProbabilityTypes.TWEAK]: {
        startValue: 0.01,
        endValue: 0.005,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_POINT]: {
        startValue: 0.01,
        endValue: 0.005,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        startValue: 0.002,
        endValue: 0.005,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.002,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.002,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.RESET_CHROMOSOME]: {
        startValue: 0.0001,
        endValue: 0.0003,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        startValue: 0.01,
        endValue: 0.005,
        startFitness: 0,
        endFitness: targetFitness,
      },
    },
  },
  stopCriteria: {
    targetFitness: 1,
    maxGenerations: 20_000,
  },
};

export default parameters;
