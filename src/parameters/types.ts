import { type PopulationParameters } from '../population/types'

export interface StopCriteria {
  targetFitness: number
  maxGenerations: number
}

export interface ParametersState {
  population: PopulationParameters
  stopCriteria: StopCriteria
}

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
