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

const maxPopulation = 500;

export const ParameterBounds = {
  population: {
    size: {
      min: 2,
      max: maxPopulation,
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
      max: maxPopulation,
      step: 2,
    },
    tournamentSize: {
      min: 0,
      max: maxPopulation,
      step: 2,
    },
  },
  crossover: {
    probabilities: {
      [ProbabilityTypes.SWAP]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
    },
  },
  mutation: {
    [DistributionTypes.COLOR_SIGMA]: {
      min: 0,
      max: 1,
      step: 0.0001,
    },
    [DistributionTypes.POINT_SIGMA]: {
      min: 0,
      max: 1,
      step: 0.0001,
    },
    [DistributionTypes.PERMUTE_SIGMA]: {
      min: 0,
      max: 1,
      step: 0.0001,
    },
    probabilities: {
      [ProbabilityTypes.TWEAK_COLOR]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.TWEAK_POINT]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.ADD_POINT]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.REMOVE_POINT]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.ADD_CHROMOSOME]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.REMOVE_CHROMOSOME]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.RESET_CHROMOSOME]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
      [ProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        min: 0,
        max: 1,
        step: 0.0001,
      },
    },
  },
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
    maxGenerations: 100_000,
  },
};

export default parameters;
