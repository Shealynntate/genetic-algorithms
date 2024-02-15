import { type ParametersState, type FormField, type ParameterLabelsType } from './types'
// Note: For image imports to be base64 and not a path, need to be under ~10kb
import defaultTarget from '../assets/mona_lisa.jpeg'
import { type SelectionType, type MutationProbabilityType, type CrossoverType, type DistributionTypes, type CrossoverProbabilityTypes } from '../population/types'
import { type AppState } from '../navigation/types'

export const maxPopulation = 500

export const maxGenerations = 500_000

export const targetFitness = 1

export const workerBatchSize = 40

// The Default Parameters for a Simulation
// --------------------------------------------------
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
      type: 'twoPoint',
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
        permuteChromosomes: 0.0014
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

export const MutationProbabilityFormFields: Record<MutationProbabilityType, FormField> = {
  tweakColor: {
    text: 'Tweak Color',
    tooltip: 'Chance of nudging the rgba channels of a polygon'
  },
  tweakPoint: {
    text: 'Tweak Point',
    tooltip: 'Chance of nudging the (x,y) values of a point'
  },
  addPoint: {
    text: '+ Point',
    tooltip: 'Chance of adding a (x,y) point to a polygon'
  },
  removePoint: {
    text: '- Point',
    tooltip: 'Chance of removing a (x,y) point from a polygon'
  },
  addChromosome: {
    text: '+ 🧬',
    tooltip: 'Chance of adding a new chromosome'
  },
  removeChromosome: {
    text: '- 🧬',
    tooltip: 'Chance of removing an existing chromosome'
  },
  permuteChromosomes: {
    text: 'Permute',
    tooltip: 'Chance of swapping the order of chromosomes in an organism'
  }
}

export const ParameterLabels: ParameterLabelsType = {
  population: {
    size: {
      text: 'Size',
      tooltip: 'How many organisms are in the population'
    },
    minPolygons: {
      text: 'Min △',
      tooltip: 'Min number of chromosomes (polygons) an organism can have'
    },
    maxPolygons: {
      text: 'Max △',
      tooltip: 'Max number of chromosomes (polygons) an organism can have'
    },
    minPoints: {
      text: 'Min Sides',
      tooltip: 'Min number of points a chromosome (polygon) can have'
    },
    maxPoints: {
      text: 'Max Sides',
      tooltip: 'Max number of points a chromosome (polygon) can have'
    },
    target: {
      text: 'Target Image',
      tooltip: 'Drag n\' drop a new target image here'
    },
    selection: {
      type: {
        text: 'Type',
        tooltip: 'The method used to select parents for the next generation'
      },
      eliteCount: {
        text: 'Elites',
        tooltip: 'The number of top organisms that are automatically passed to the next generation'
      },
      tournamentSize: {
        text: 'Tourney Size',
        tooltip: 'The number of organisms that compete in a selection tournament'
      }
    },
    crossover: {
      type: {
        text: 'Type',
        tooltip: 'The method used to combine the chromosomes of two parents'
      },
      probabilities: {
        swap: {
          text: 'Swap',
          tooltip: 'The probability of swapping the chromosomes of two parents'
        }
      }
    },
    mutation: {
      colorSigma: {
        text: 'Color',
        tooltip: 'How far a color channel (rgba) can get nudged'
      },
      pointSigma: {
        text: 'Point',
        tooltip: 'How far a point (x,y) can get nudged'
      },
      probabilities: {
        tweakColor: {
          text: 'Color',
          tooltip: 'Chance of nudging the rgba channels of a polygon'
        },
        tweakPoint: {
          text: 'Point',
          tooltip: 'Chance of nudging the (x,y) values of a point'
        },
        addPoint: {
          text: 'Point +',
          tooltip: 'Chance of adding a (x,y) point to a polygon'
        },
        removePoint: {
          text: 'Point -',
          tooltip: 'Chance of removing a (x,y) point from a polygon'
        },
        addChromosome: {
          text: 'Add',
          tooltip: 'Chance of adding a new chromosome'
        },
        removeChromosome: {
          text: 'Remove',
          tooltip: 'Chance of removing an existing chromosome'
        },
        permuteChromosomes: {
          text: 'Permute',
          tooltip: 'Chance of swapping the order of chromosomes in an organism'
        }
      }
    }
  },
  stopCriteria: {
    targetFitness: {
      text: 'Target Fitness',
      tooltip: 'The fitness score that is considered "good enough"'
    },
    maxGenerations: {
      text: 'Max Gens',
      tooltip: 'The maximum number of generations the simulation will run'
    }
  }
}

// Type Labels
// --------------------------------------------------
export const SelectionTypeLabels: Record<SelectionType, string> = {
  roulette: 'Roulette',
  tournament: 'Tournament',
  sus: 'SUS'
}

export const CrossoverTypeLabels: Record<CrossoverType, string> = {
  onePoint: 'One Point',
  twoPoint: 'Two Point',
  uniform: 'Uniform'
}

export const DistSigmaLabels: Record<DistributionTypes, string> = {
  colorSigma: 'Color',
  pointSigma: 'Points'
}

export const MutationProbabilityLabels: Record<MutationProbabilityType, string> = {
  tweakColor: 'Tweak Color',
  tweakPoint: 'Tweak Point',
  addPoint: 'Add Point',
  removePoint: 'Remove Point',
  addChromosome: 'Add Chromosome',
  removeChromosome: 'Remove Chromosome',
  permuteChromosomes: 'Permute Chromosomes'
}

export const CrossoverProbabilityLabels: Record<CrossoverProbabilityTypes, string> = {
  swap: 'Swap'
}

export const primaryButtonLabels: Record<AppState, string> = {
  none: 'Run',
  running: 'Pause',
  paused: 'Resume',
  complete: 'Run'
}

export const statusLabels: Record<AppState, string> = {
  none: 'None',
  running: 'Running',
  paused: 'Paused',
  complete: 'Complete'
}
