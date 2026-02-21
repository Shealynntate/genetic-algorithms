import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  getFirestore,
  type Timestamp
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { type User, getAuth, onAuthStateChanged } from 'firebase/auth'
import store from '../store'
import { type ExperimentRecord, type ExperimentRecordDbEntry } from './types'
import { GIF_FILE, TARGET_IMAGE_FILE, firebaseConfig } from './config'
import { toTimestamp } from './utils'

// Initialize Firebase and its services
// ------------------------------------------------------------
export const firebase = initializeApp(firebaseConfig)
export const firebaseAnalytics = getAnalytics(firebase)
export const firestore = getFirestore(firebase)
export const storage = getStorage(firebase)
export const auth = getAuth(firebase)

// Conversion Functionality
// ------------------------------------------------------------
export const experimentRecordConverter = {
  toFirestore: (record: ExperimentRecord): ExperimentRecordDbEntry => {
    const { createdOn, id, lastModified, parameters, gif, ...rest } = record

    return {
      createdOn: toTimestamp(createdOn),
      lastModified: toTimestamp(lastModified),
      parameters: {
        ...parameters,
        population: {
          ...parameters.population,
          target: `experiments/${id}/${TARGET_IMAGE_FILE}`
        }
      },
      gif: gif != null ? `experiments/${id}/${GIF_FILE}` : '',
      ...rest
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ExperimentRecord => {
    const data = snapshot.data(options) as ExperimentRecordDbEntry
    const { createdOn, lastModified, ...rest } = data

    return {
      id: snapshot.id,
      createdOn: (createdOn as Timestamp).toMillis(),
      lastModified: (lastModified as Timestamp).toMillis(),
      ...rest
    }
  }
}

// Authentication Functionality
// ------------------------------------------------------------
const monitorAuthState = (): void => {
  onAuthStateChanged(auth, (user: User | null) => {
    if (user != null) {
      store.dispatch({ type: 'navigation/setIsAuthenticated', payload: true })
    } else {
      store.dispatch({ type: 'navigation/setIsAuthenticated', payload: false })
    }
  })
}

monitorAuthState()
