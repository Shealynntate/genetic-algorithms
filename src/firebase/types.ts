import { type FieldValue } from 'firebase/firestore'
import { type Organism } from '../population/types'
import { type ParametersState } from '../parameters/types'

/**
 * The local representation of the data object stored in firebase firestore for each experiment
 */
export interface ExperimentRecord {
  id?: string
  createdOn: number | FieldValue
  lastModified: number | FieldValue
  /** The order of the experiment in the gallery */
  order: number
  /** The actual Gif content as a base64 string */
  gif: string
  simulationName: string
  simulationId: number
  /** Where the target is the actual image as a base64 string */
  parameters: ParametersState
  maxFitOrganism: Organism
  results: ExperimentStatsRecord[]
}

/**
 *  The data object stored in firebase firestore for each experiment
 */
export interface ExperimentRecordDbEntry {
  id?: string
  createdOn: number | FieldValue
  lastModified: number | FieldValue
  simulationName: string
  simulationId: number
  /** The order of the experiment in the gallery */
  order: number
  /** A relative file path to the gif in firebase storage */
  gif: string
  results: ExperimentStatsRecord[]
  /** Where the target is a relative file path to the image in firebase storage */
  parameters: ParametersState
  maxFitOrganism: Organism
}

export interface ExperimentStatsRecord {
  threshold: number
  stats: ExperimentStats
}

/**
 * The same as {@link GenerationStatsRecord} except with the maxFitOrganism and isGlobalBest fields
 * removed to save space in the database
 */
export interface ExperimentStats {
  deviation: number
  gen: number
  maxFitness: number
  minFitness: number
  meanFitness: number
}
