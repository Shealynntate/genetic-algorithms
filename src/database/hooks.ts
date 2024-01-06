import { useLiveQuery } from 'dexie-react-hooks'
import { type Image } from './types'
import db, { currentSimulationId, getCurrentImages } from './api'

export const useImageDbQuery = (): Image[] | undefined => useLiveQuery(
  async () => {
    if (currentSimulationId == null) return []

    return await getCurrentImages()
  },
  [currentSimulationId]
)

export const useGetSimulations = (ids: number[]) => useLiveQuery(
  async () => await db.simulations.bulkGet(ids)
)

export const useGetAllSimulations = () => useLiveQuery(
  async () => await getAllSimulations()
)

export const useGetCurrentSimulation = () => useLiveQuery(
  async () => await db.simulations.get({ status: 'running' })
)

export const useGetCompletedSimulations = () => useLiveQuery(
  async () => await db.simulations.where('status').equals('complete').toArray()
)

export const useGetPendingSimulations = () => useLiveQuery(
  async () => await db.simulations.where('status').equals('pending').toArray()
)

export const useGetGalleryEntries = () => useLiveQuery(
  async () => await db.gallery.toArray()
)

export const useGetAllResults = () => useLiveQuery(
  async () => await db.results.toArray()
)

export const useGetCompletedSimulationsAndResults = () => useLiveQuery(async () => {
  const completedSimulations = await db.simulations.where('status').equals('complete').toArray() || []
  const results = await db.results.toArray() || []

  const findResult = (simId) => {
    const result = results.find((entry) => entry.simulationId === simId)
    return result ? result.results : []
  }

  return completedSimulations.map((simulation) => (
    { ...simulation, results: findResult(simulation.id) }
  ))
})
