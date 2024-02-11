import { type ExperimentRecord } from '../firebase/types'

/**
 * A non-mutating function that sorts the gallery entries by their order
 * @param entries the gallery entries to sort
 * @returns a new array of gallery entries sorted by their order
 */
export const sortGalleryEntries = (entries: ExperimentRecord[]): ExperimentRecord[] => {
  return [...entries].sort((a, b) => a.order - b.order)
}

/**
 * Determines if the order of the gallery entries has changed using their IDs
 * @param oldEntries the array of gallery entries before the change
 * @param newEntries the array of gallery entries after the change
 * @returns true if the order has changed, false otherwise
 */
export const hasOrderChanged = (oldEntries: ExperimentRecord[], newEntries: ExperimentRecord[]): boolean => {
  if (oldEntries.length !== newEntries.length) return true

  return oldEntries.some((entry, index) => entry.id !== newEntries[index].id)
}

/**
 * Determines if the data of the gallery entries has changed using their IDs
 * @param oldEntries the array of gallery entries before the change
 * @param newEntries the array of gallery entries after the change
 * @returns true if the data has changed, false otherwise
 */
export const hasDataChanged = (oldEntries: ExperimentRecord[], newEntries: ExperimentRecord[]): boolean => {
  if (oldEntries.length !== newEntries.length) return true

  return oldEntries.some((entry, index) => entry.id !== newEntries[index].id)
}
