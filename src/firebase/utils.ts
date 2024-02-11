import { type FieldValue, Timestamp } from 'firebase/firestore'

export const toTimestamp = (timestamp: number | FieldValue): Timestamp | FieldValue => {
  if (typeof timestamp === 'number') {
    return Timestamp.fromMillis(timestamp)
  }
  return timestamp
}
