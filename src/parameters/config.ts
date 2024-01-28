// Important Note: For image imports to be base64 and not a path, need to be under ~10kb
import defaultTarget from '../assets/mona_lisa.jpeg'
// import defaultTarget from '../assets/son_of_man.jpeg';
// import defaultTarget from '../assets/composition_II.jpeg';
import { type ParametersState } from './types'
import { maxPopulation, maxGenerations } from '../constants/constants'

// The Default Parameters for a Simulation
export const defaultParameters: ParametersState = {
  population: {
    size: 200,
    minGenomeSize: 1,
    maxGenomeSize: 50,
    minPoints: 3,
    maxPoints: 10,
    target: defaultTarget,
    selection: {
      type: 'tournament',
      eliteCount: 0,
      tournamentSize: 2
    },
    crossover: {
      type: 'onePoint',
      probabilities: {
        swap: 0.9
      }
    },
    mutation: {
      genomeSize: 50,
      distributions: {
        colorSigma: 0.1,
        pointSigma: 0.1
      },
      probabilities: {
        tweakColor: 0.00067,
        tweakPoint: 0.00067,
        addPoint: 0.00067,
        removePoint: 0.00067,
        addChromosome: 0.0014,
        removeChromosome: 0.00067,
        permuteChromosomes: 0.00067
      }
    }
  },
  stopCriteria: {
    targetFitness: 1,
    maxGenerations: 200_000
  }
}

export const ParameterBounds = {
  population: {
    size: {
      min: 2,
      max: maxPopulation,
      step: 2
    },
    minPolygons: {
      min: 1,
      max: 100,
      step: 1
    },
    maxPolygons: {
      min: 1,
      max: 100,
      step: 1
    },
    minPoints: {
      min: 2,
      max: 16,
      step: 1
    },
    maxPoints: {
      min: 2,
      max: 16,
      step: 1
    }
  },
  selection: {
    eliteCount: {
      min: 0,
      max: maxPopulation,
      step: 2
    },
    tournamentSize: {
      min: 0,
      max: maxPopulation,
      step: 2
    }
  },
  crossover: {
    probabilities: {
      swap: {
        min: 0,
        max: 1,
        step: 0.0001
      }
    }
  },
  mutation: {
    colorSigma: {
      min: 0,
      max: 1,
      step: 0.0001
    },
    pointSigma: {
      min: 0,
      max: 1,
      step: 0.0001
    },
    probabilities: {
      tweak: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      tweakColor: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      tweakPoint: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      addPoint: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      removePoint: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      addChromosomes: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      removeChromosomes: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      permuteChromosomes: {
        min: 0,
        max: 1,
        step: 0.0001
      }
    }
  },
  stopCriteria: {
    targetFitness: {
      min: 0,
      max: 1,
      step: 0.001
    },
    maxGenerations: {
      min: 1,
      max: maxGenerations,
      step: 1
    }
  }
}
