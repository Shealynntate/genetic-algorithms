import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { type QueryDocumentSnapshot, type SnapshotOptions, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from './config'
import { type SimulationReport } from '../database/types'

// Initialize Firebase and its services
// ------------------------------------------------------------
export const firebase = initializeApp(firebaseConfig)
export const firebaseAnalytics = getAnalytics(firebase)
export const firestore = getFirestore(firebase)
export const storage = getStorage(firebase)

/**
 *  The data stored in firebase firestore
 */
export interface ExperimentRecord {
  id?: string
  createdOn: number
  lastModified: number
  /** Where the gif and target are relative paths instead of base64 strings */
  simulationReport: SimulationReport
}

export interface ExperimentRecordDbEntry {
  createdOn: number
  lastModified: number
  simulationReport: SimulationReport
}

// Conversion Functionality
// ------------------------------------------------------------
export const experimentRecordConverter = {
  toFirestore: (record: ExperimentRecord): ExperimentRecordDbEntry => {
    const { createdOn, lastModified, simulationReport } = record
    simulationReport.gif = ''
    simulationReport.simulation.parameters.population.target = ''

    return {
      createdOn,
      lastModified,
      simulationReport
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ExperimentRecord => {
    const data = snapshot.data(options) as ExperimentRecordDbEntry
    const { createdOn, lastModified, simulationReport } = data
    // TODO: Get gif and target from relative paths
    simulationReport.gif = ''
    simulationReport.simulation.parameters.population.target = ''

    return {
      id: snapshot.id,
      createdOn,
      lastModified,
      simulationReport
    }
  }
}
// To Firebase
// (results: Results, simulation: Simulation, galleryEntry: GalleryEntry) {
//  Combine these into one SimulationReport object
// }
