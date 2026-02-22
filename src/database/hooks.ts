import { useLiveQuery } from 'dexie-react-hooks'

import db, {
  currentSimulationId,
  getAllSimulations,
  getCompletedSimulations,
  getCurrentImages,
  getCurrentSimulation,
  getGifEntryBySimulation,
  getPendingSimulations,
  getSimulationRecords,
  getSimulations
} from './api'
import {
  type Gif,
  type Image,
  type Simulation,
  type Results,
  type SimulationReport
} from './types'
import { type GenerationStatsRecord } from '../population/types'

// Simulation Hooks
// --------------------------------------------------
export const useGetSimulations = (
  ids: number[]
): (Simulation | undefined)[] | undefined =>
  useLiveQuery(async () => await getSimulations(ids))

export const useGetAllSimulations = (): Simulation[] | undefined =>
  useLiveQuery(async () => await getAllSimulations(), [currentSimulationId])

export const useGetAllButCurrentSimulation = (): Simulation[] | undefined =>
  useLiveQuery(async () => {
    const allSimulations = await getAllSimulations()
    return allSimulations.filter((sim) => sim.id !== currentSimulationId)
  }, [currentSimulationId])

export const useGetCurrentSimulation = (): Simulation | undefined =>
  useLiveQuery(async () => await getCurrentSimulation(), [currentSimulationId])

export const useGetCompletedSimulations = (): Simulation[] | undefined =>
  useLiveQuery(async () => await getCompletedSimulations())

export const useGetPendingSimulations = (): Simulation[] | undefined =>
  useLiveQuery(async () => await getPendingSimulations())

// Gallery Hooks
// --------------------------------------------------
export const useGetGalleryEntries = (): Gif[] | undefined =>
  useLiveQuery(async () => await db.gifs.toArray())

// Results Hooks
// --------------------------------------------------
export const useGetAllResults = (): Results[] | undefined =>
  useLiveQuery(async () => await db.results.toArray())

export const useGetCompletedSimulationReports = ():
  | SimulationReport[]
  | undefined =>
  useLiveQuery(async () => {
    return await db
      .transaction('r', db.simulations, db.results, db.gifs, async () => {
        const completedSimulations = await getCompletedSimulations()

        const findResults = async (
          simId: number | undefined
        ): Promise<GenerationStatsRecord[] | undefined> => {
          if (simId == null) {
            throw new Error(
              '[useGetCompletedSimulationReports] Simulation ID is null'
            )
          }
          return await getSimulationRecords(simId)
        }

        return await Promise.all(
          completedSimulations.map(async (simulation) => {
            if (simulation.id == null) {
              throw new Error(
                `[useGetCompletedSimulationReports] Simulation ID is null: ${simulation.id}`
              )
            }
            const results = await findResults(simulation.id)
            if (results == null) {
              throw new Error(
                `[useGetCompletedSimulationReports] Results are null: ${simulation.id}`
              )
            }
            const gifEntry = await getGifEntryBySimulation(simulation.id)
            if (gifEntry == null) {
              throw new Error(
                `[useGetCompletedSimulationReports] Gif Entry is null: ${simulation.id}`
              )
            }
            return { simulation, results, gif: gifEntry.gif }
          })
        )
      })
      .catch((e) => {
        console.error(`[useGetCompletedSimulationReports] ${e}`)
        return undefined
      })
  })

export const useGetCurrentSimulationReport = (): SimulationReport | undefined =>
  useLiveQuery(async () => {
    const simulation = await getCurrentSimulation()
    if (simulation?.id == null) {
      return undefined
    }
    const results = await getSimulationRecords(simulation.id)
    if (results == null) {
      return undefined
    }
    return { simulation, results }
  }, [currentSimulationId])

// Image Hooks
// --------------------------------------------------
export const useImageDbQuery = (): Image[] | undefined =>
  useLiveQuery(async () => {
    if (currentSimulationId == null) return []

    return await getCurrentImages()
  }, [currentSimulationId])
