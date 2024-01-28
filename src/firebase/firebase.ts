import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from './config'

// Initialize Firebase and its services
// ------------------------------------------------------------
export const firebase = initializeApp(firebaseConfig)
export const firebaseAnalytics = getAnalytics(firebase)
export const firestore = getFirestore(firebase)
export const storage = getStorage(firebase)
