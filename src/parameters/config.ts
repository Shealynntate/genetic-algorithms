// Important Note: For image imports to be base64 and not a path, need to be under ~10kb
import defaultTarget from '../assets/mona_lisa.jpeg'
// import defaultTarget from '../assets/son_of_man.jpeg';
// import defaultTarget from '../assets/composition_II.jpeg';
import { type ParametersState } from './types'
import { targetFitness, maxPopulation, maxGenerations } from '../constants/constants'

// The Default Parameters for a Simulation
export const defaultParameters: ParametersState = {
  population: {
    size: 200,
    minGenomeSize: 50,
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
      type: 'twoPoint',
      probabilityParameters: {
        swap: {
          startValue: 0.9,
          endValue: 0.9,
          startFitness: 0,
          endFitness: targetFitness
        }
      }
    },
    mutation: {
      isSinglePoint: true,
      genomeSize: 50,
      distributions: {
        colorSigma: 0.06,
        pointSigma: 0.06,
        permuteSigma: 0.05
      },
      probabilityParameters: {
        tweak: {
          startValue: 0.04,
          endValue: 0.04,
          startFitness: 0,
          endFitness: targetFitness
        },
        tweakColor: {
          startValue: 0.01,
          endValue: 0.003,
          startFitness: 0,
          endFitness: targetFitness
        },
        tweakPoint: {
          startValue: 0.01,
          endValue: 0.003,
          startFitness: 0,
          endFitness: targetFitness
        },
        addPoint: {
          startValue: 0.0015,
          endValue: 0.0015,
          startFitness: 0,
          endFitness: targetFitness
        },
        removePoint: {
          startValue: 0.0015,
          endValue: 0.0015,
          startFitness: 0,
          endFitness: targetFitness
        },
        addChromosome: {
          startValue: 0,
          endValue: 0,
          startFitness: 0,
          endFitness: targetFitness
        },
        removeChromosome: {
          startValue: 0,
          endValue: 0,
          startFitness: 0,
          endFitness: targetFitness
        },
        resetChromosome: {
          startValue: 0.0006,
          endValue: 0.0006,
          startFitness: 0,
          endFitness: targetFitness
        },
        permuteChromosomes: {
          startValue: 0.0015,
          endValue: 0.0015,
          startFitness: 0,
          endFitness: targetFitness
        }
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
    permuteSigma: {
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
      resetChromosomes: {
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
