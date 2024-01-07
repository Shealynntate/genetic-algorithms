import { useLiveQuery } from 'dexie-react-hooks'
import {
  type Simulation,
  type Image,
  type GalleryEntry,
  type Results,
  type SimulationReport
} from './types'
import db, {
  currentSimulationId,
  getAllSimulations,
  getCompletedSimulations,
  getCurrentImages,
  getCurrentSimulation,
  getPendingSimulations,
  getSimulationResults,
  getSimulations
} from './api'

// Simulation Hooks
// --------------------------------------------------
export const useGetSimulations = (
  ids: number[]
): Array<Simulation | undefined> | undefined => useLiveQuery(
  async () => await getSimulations(ids)
)

export const useGetAllSimulations = (): Simulation[] | undefined => useLiveQuery(
  async () => await getAllSimulations()
)

export const useGetCurrentSimulation = (): Simulation | undefined => useLiveQuery(
  async () => await getCurrentSimulation()
)

export const useGetCompletedSimulations = (): Simulation[] | undefined => useLiveQuery(
  async () => await getCompletedSimulations()
)

export const useGetPendingSimulations = (): Simulation[] | undefined => useLiveQuery(
  async () => await getPendingSimulations()
)

// Gallery Hooks
// --------------------------------------------------
export const useGetGalleryEntries = (): GalleryEntry[] | undefined => useLiveQuery(
  async () => await db.gallery.toArray()
)

// Results Hooks
// --------------------------------------------------
export const useGetAllResults = (): Results[] | undefined => useLiveQuery(
  async () => await db.results.toArray()
)

export const useGetCompletedSimulationReports = (): SimulationReport[] | undefined => useLiveQuery(
  async () => {
    const completedSimulations = await getCompletedSimulations()

    const findResults = async (simId: number | undefined): Promise<Results | undefined> => {
      if (simId == null) {
        throw new Error('[useGetCompletedSimulationReports] Simulation ID is null')
      }
      return await getSimulationResults(simId)
    }

    return await Promise.all(
      completedSimulations.map(async (simulation) => {
        const results = await findResults(simulation.id)
        if (results == null) {
          throw new Error(`[useGetCompletedSimulationReports] Results are null: ${simulation.id}`)
        }
        return { simulation, results }
      })
    )
  }
)

// Image Hooks
// --------------------------------------------------
export const useImageDbQuery = (): Image[] | undefined => useLiveQuery(
  async () => {
    if (currentSimulationId == null) return []

    return await getCurrentImages()
  },
  [currentSimulationId]
)
