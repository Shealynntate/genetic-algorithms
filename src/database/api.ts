import GeneticAlgorithmsDatabase from './GeneticAlgorithmsDatabase'
import {
  type Stats,
  type Image,
  type MutableSimulation,
  type Simulation,
  type Results
} from './types'
import { type Organism } from '../population/types'

const db = new GeneticAlgorithmsDatabase()
export let currentSimulationId: number | undefined

// Simulations Table
// --------------------------------------------------
/**
 * A way to insert a new simulation entry into the database.
 * @param simulation the simulation entry to insert
 * @returns the id of the inserted simulation
 */
export const insertSimulation = async (simulation: Simulation): Promise<number> => {
  const { population, parameters, status = 'unknown' } = simulation

  return await db.simulations.add({
    name: 'Untitled Run',
    population,
    parameters,
    status,
    createdOn: Date.now(),
    lastUpdated: Date.now()
  })
}

export const getSimulation = async (id: number): Promise<Simulation | undefined> => {
  return await db.simulations.get(id)
}

export const getSimulations = async (ids: number[]): Promise<Array<Simulation | undefined>> => {
  return await db.simulations.bulkGet(ids)
}

export const getSimulationsByStatus = async (status: string): Promise<Simulation[]> => {
  return await db.simulations.where('status').equals(status).toArray()
}

export const getSimulationByStatus = async (status: string): Promise<Simulation | undefined> => {
  return await db.simulations.where('status').equals(status).first()
}

export const getCurrentSimulation = async (): Promise<Simulation | undefined> => {
  if (currentSimulationId === undefined) return undefined

  return await db.simulations.get(currentSimulationId)
}

export const getAllSimulations = async (): Promise<Simulation[]> => {
  return await db.simulations.toArray()
}

export const getPendingSimulations = async (): Promise<Simulation[]> => {
  return await getSimulationsByStatus('pending')
}

export const getCompletedSimulations = async (): Promise<Simulation[]> => {
  return await getSimulationsByStatus('complete')
}

/**
 * A way to update some of the fields of a simulation entry.
 * @param id the id of the simulation to update
 * @param data the fields to update, must be a subset of the fields in {@link MutableSimulation}
 * @returns a promise that resolves to the number of entries updated
 */
export const updateSimulation = async (
  id: number,
  data: Partial<MutableSimulation>
): Promise<number> => {
  return await db.simulations.update(id, {
    lastUpdated: Date.now(),
    ...data
  })
}

export const updateCurrentSimulation = async (
  data: Partial<MutableSimulation>
): Promise<number> => {
  if (currentSimulationId == null) {
    throw new Error('[updateCurrentSimulation] Current simulation ID is not set, cannot update it')
  }
  return await updateSimulation(currentSimulationId, data)
}

// TODO: Move this logic into the sagas
export const runNextPendingSimulation = async (): Promise<Simulation | undefined> => {
  const next = await getSimulationByStatus('pending')
  if (next != null) {
    currentSimulationId = next.id
    await updateCurrentSimulation({ status: 'running' })
  }

  return next
}

/**
 * Update the name of a simulation entry.
 * @param simulationId the id of the simulation to rename
 * @param name the new name for the simulation
 * @returns a promise that resolves to the number of entries updated
 */
export const renameSimulation = async (simulationId: number, name: string): Promise<number> => {
  return await db.simulations.update(simulationId, { name })
}

/**
 * Set the current simulation to the given simulation id or clear it if null.
 * @param simulationId the id of the simulation to set as the current simulation,
 * or null to clear the current simulation
 * @returns the simulation entry for the current simulation, or null if no simulation is set
 */
export const setCurrentSimulation = async (
  simulationId: number | null
): Promise<Simulation | null> => {
  if (simulationId == null) {
    // Clear out current simulation state
    currentSimulationId = undefined

    return null
  }

  const entry = await db.simulations.get(simulationId)
  if (entry == null) {
    throw new Error(`[setCurrentSimulation] No entry found for simulationId ${simulationId}`)
  }
  currentSimulationId = simulationId

  return entry
}

// export const duplicateSimulation = async (simId: number, isSaved = 1) => {
//   return await db.transaction('rw', db.simulations, db.images, async () => {
//     // First get the correct simulation entry
//     const simEntry = await getSimulation(simId)
//     if (simEntry == null) {
//       throw new Error(`[duplicateSimulation] No entry found for simulationId ${simId}`)
//     }
//     const { name, population, reduxState } = Dexie.deepClone(simEntry)
//     // Create a copy and insert into the table as a new entry
//     const nextId = await db.simulations.add({
//       name,
//       population,
//       reduxState,
//       isSaved,
//       createdOn: Date.now(),
//       lastUpdated: Date.now()
//     })
//     // Next, duplicate the image history for the simulation, using the new simulationId
//     const imageData = await db.images.where('simulationId').equals(simId).toArray()
//     imageData.forEach(({ id, ...entry }) => {
//       db.images.add({ ...Dexie.deepClone(entry), simulationId: nextId })
//     })

//     return nextId
//   })
// }

// export const saveCurrentSimulation = async (population, reduxState) => {
//   // First update the population values stored in the table
//   await updateCurrentSimulation(population, reduxState, 0)
//   // Then duplicate it, it'll be marked as saved
//   return await duplicateSimulation(currentSimulationId)
// }

// export const restoreSimulation = async (simulationId: number) => {
//   const newId = await duplicateSimulation(simulationId, 0)
//   return await setCurrentSimulation(newId)
// }

export const deleteSimulation = async (id: number): Promise<number[]> => {
  await db.simulations.delete(id)
  // Delete all matching simulationId entries
  return await Promise.all([
    db.images.where('simulationId').equals(id).delete(),
    db.results.where('simulationId').equals(id).delete()
  ])
}

export const deleteCurrentSimulation = async (): Promise<number[]> => {
  if (currentSimulationId == null) {
    throw new Error('[deleteCurrentSimulation] Current simulation ID is not set, cannot delete it')
  }
  return await deleteSimulation(currentSimulationId)
}

// Simulation Results Table
// --------------------------------------------------
export const insertResultsEntry = async (
  simulationId: number,
  stats: Stats[] = []
): Promise<number> => {
  return await db.results.add({
    simulationId,
    createdOn: Date.now(),
    lastUpdated: Date.now(),
    stats
  })
}

export const insertResultsForCurrentSimulation = async (results: Stats[]): Promise<number> => {
  if (currentSimulationId == null) {
    throw new Error('[insertResultsForCurrentSimulation] Current simulation ID is null')
  }
  return await insertResultsEntry(currentSimulationId, results)
}

export const getSimulationResults = async (simulationId: number): Promise<Results | undefined> => {
  return await db.results.get({ simulationId })
}

export const getCurrentSimulationResults = async (): Promise<Results | undefined> => {
  if (currentSimulationId == null) {
    throw new Error('[getCurrentSimulationResults] Current simulation ID is not set')
  }
  return await getSimulationResults(currentSimulationId)
}

export const addStatsForCurrentSimulation = async (stats: Stats): Promise<number> => {
  const entry = await getCurrentSimulationResults()
  if (entry?.id == null) {
    throw new Error('[addStatsForCurrentSimulation] No valid results entry found')
  }

  return await db.results.update(entry.id, { results: [...entry.stats, stats] })
}

// Images Table
// --------------------------------------------------
export const addImageToDatabase = async (gen: number, maxFitOrganism: Organism): Promise<number> => {
  if (currentSimulationId == null) {
    throw new Error('[addImageToDatabase] Current simulation ID is not set, cannot add image')
  }
  const { fitness, phenotype, genome } = maxFitOrganism

  return await db.images.add({
    gen,
    fitness,
    genome,
    imageData: phenotype,
    simulationId: currentSimulationId
  })
}

/**
 * Get all images for a given simulation ID.
 * @param simulationId the id of the simulation to get images for
 * @returns a promise that resolves to an array of images
 */
export const getImages = async (simulationId: number): Promise<Image[]> => {
  return await db.images.where('simulationId').equals(simulationId).toArray()
}

// TODO: Should this throw if currentSimulationId is null?
export const getCurrentImages = async (): Promise<Image[]> => {
  if (currentSimulationId == null) return []

  return await getImages(currentSimulationId)
}

// Gallery Table
// --------------------------------------------------
export const addGalleryEntry = async (simulationId: number, json: string): Promise<number> => {
  return await db.gallery.add({
    createdOn: Date.now(),
    simulationId,
    name: `Entry ${simulationId}`,
    json
  })
}

export const renameGalleryEntry = async (id: number, name: string): Promise<number> => {
  return await db.gallery.update(id, { name })
}

export const deleteGalleryEntry = async (id: number): Promise<void> => {
  await db.gallery.delete(id)
}

// All Tables
// --------------------------------------------------
export const clearRunningSimulations = async (): Promise<void> => {
  const sims = await getSimulationsByStatus('running')
  await Promise.all(
    sims.map(async (sim): Promise<void> => {
      if (sim?.id == null) {
        console.error('[clearRunningSimulation] No running simulation ID found')
        return
      }
      await deleteSimulation(sim.id)
    })
  )
}

// Database Setup
// --------------------------------------------------
const setupDatabase = async (): Promise<void> => {
  try {
    await db.open()
    await clearRunningSimulations()
  } catch (err) {
    console.error('[setupDatabase] Error opening database', err)
  }
}
setupDatabase().catch(console.error)

export default db
