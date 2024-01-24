import { type AppState } from '../navigation/types'
import {
  type DistributionTypes,
  type CrossoverType,
  type SelectionType,
  type MutationProbabilityType,
  type CrossoverProbabilityTypes
} from '../population/types'
import ChromosomeIcon from '../common/ChromosomeIcon'

export interface FormField {
  text: string
  tooltip?: string
  Icon?: React.ComponentType
}

export interface ParameterLabelsType {
  population: {
    size: FormField
    minPolygons: FormField
    maxPolygons: FormField
    minPoints: FormField
    maxPoints: FormField
    target: FormField
    selection: {
      type: FormField
      eliteCount: FormField
      tournamentSize: FormField
    }
    crossover: {
      type: FormField
      probabilities: {
        swap: FormField
      }
    }
    mutation: {
      colorSigma: FormField
      pointSigma: FormField
      probabilities: {
        tweakColor: FormField
        tweakPoint: FormField
        addPoint: FormField
        removePoint: FormField
        addChromosome: FormField
        removeChromosome: FormField
        permuteChromosomes: FormField
      }
    }
  }
  stopCriteria: {
    targetFitness: FormField
    maxGenerations: FormField
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
        text: 'Type'
      },
      eliteCount: {
        text: 'Elite Count'
      },
      tournamentSize: {
        text: 'Tourney Size'
      }
    },
    crossover: {
      type: {
        text: 'Type'
      },
      probabilities: {
        swap: {
          text: 'Swap'
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
          Icon: ChromosomeIcon,
          tooltip: 'Chance of adding a new chromosome'
        },
        removeChromosome: {
          text: 'Remove',
          Icon: ChromosomeIcon,
          tooltip: 'Chance of removing an existing chromosome'
        },
        permuteChromosomes: {
          text: 'Permute',
          Icon: ChromosomeIcon,
          tooltip: 'Chance of swapping the order of chromosomes in an organism'
        }
      }
    }
  },
  stopCriteria: {
    targetFitness: {
      text: 'Target Fitness'
    },
    maxGenerations: {
      text: 'Max Generations'
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
    Icon: ChromosomeIcon,
    tooltip: 'Chance of adding a new chromosome'
  },
  removeChromosome: {
    text: '- 🧬',
    Icon: ChromosomeIcon,
    tooltip: 'Chance of removing an existing chromosome'
  },
  permuteChromosomes: {
    text: 'Permute',
    Icon: ChromosomeIcon,
    tooltip: 'Chance of swapping the order of chromosomes in an organism'
  }
}

export const SimulationGraph = {
  title: 'Fitness vs Generations',
  minCheckbox: 'Min',
  meanCheckbox: 'Mean',
  deviationCheckbox: 'Deviation'
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
