// Important Note: For image imports to be base64 and not a path, need to be under ~10kb
import defaultTarget from '../assets/mona_lisa.jpeg';
// import defaultTarget from '../assets/son_of_man.jpeg';
// import defaultTarget from '../assets/composition_II.jpeg';
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
    minPolygons: {
      min: 1,
      max: 100,
      step: 1,
    },
    maxPolygons: {
      min: 1,
      max: 100,
      step: 1,
    },
    minPoints: {
      min: 2,
      max: 16,
      step: 1,
    },
    maxPoints: {
      min: 2,
      max: 16,
      step: 1,
    },
  },
  selection: {
    eliteCount: {
      min: 0,
      max: 500,
      step: 2,
    },
  },
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
      max: 500_000,
      step: 1,
    },
  },
};

export const ParameterValidation = {
  population: {
    size: (v) => ((v % 2 === 0) || 'Population size must be even'),
    minPolygons: (v, gv) => ((v <= gv('population.maxPolygons')) || 'Min polygons can\'t be greater than max polygons'),
    maxPolygons: (v, gv) => ((v >= gv('population.minPolygons')) || 'Max polygons can\'t be less than min polygons'),
    minPoints: (v, gv) => ((v <= gv('population.maxPoints')) || 'Min number of sides can\'t be greater than max sides'),
    maxPoints: (v, gv) => ((v >= gv('population.minPoints')) || 'Max number of sides can\'t be less than min sides'),
  },
  selection: {
    eliteCount: (v, gv) => (((v % 2 === 0) && v < gv('population.size')) || 'Elite count must be even and less than the population size'),
    tournamentSize: (v, gv) => ((v < gv('population.size')) || 'Tournament size must be less than the population size'),
  },
};

export const ParameterLabels = {
  population: {
    size: 'Size',
    minPolygons: 'Min △',
    maxPolygons: 'Max △',
    minPoints: 'Min Sides',
    maxPoints: 'Max Sides',
    target: 'Target Image',
  },
  selection: {
    type: 'Type',
    eliteCount: 'Elite Count',
    tournamentSize: 'Tourney Size',
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
      [ProbabilityTypes.TWEAK_COLOR]: 'Tweak Color',
      [ProbabilityTypes.TWEAK_POINT]: 'Tweak Point',
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
    minPolygons: 50,
    maxPolygons: 50,
    minPoints: 3,
    maxPoints: 10,
    target: defaultTarget,
  },
  selection: {
    type: SelectionType.TOURNAMENT,
    eliteCount: 0,
    tournamentSize: 2,
  },
  crossover: {
    type: CrossoverType.TWO_POINT,
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
    [DistributionTypes.COLOR_SIGMA]: 0.06,
    [DistributionTypes.POINT_SIGMA]: 0.06,
    [DistributionTypes.PERMUTE_SIGMA]: 0.05,
    probabilities: {
      [ProbabilityTypes.TWEAK_COLOR]: {
        startValue: 0.01,
        endValue: 0.003,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.TWEAK_POINT]: {
        startValue: 0.01,
        endValue: 0.003,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_POINT]: {
        startValue: 0.005,
        endValue: 0.005,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        startValue: 0.001,
        endValue: 0.001,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.ADD_CHROMOSOME]: {
        startValue: 0,
        endValue: 0,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.REMOVE_CHROMOSOME]: {
        startValue: 0,
        endValue: 0,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.RESET_CHROMOSOME]: {
        startValue: 0.01,
        endValue: 0.0005,
        startFitness: 0,
        endFitness: targetFitness,
      },
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        startValue: 0.01,
        endValue: 0.003,
        startFitness: 0,
        endFitness: targetFitness,
      },
    },
  },
  stopCriteria: {
    targetFitness: 1,
    maxGenerations: 80_000,
  },
};

export default parameters;
