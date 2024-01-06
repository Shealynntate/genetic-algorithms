import { useLiveQuery } from 'dexie-react-hooks'
import GeneticAlgorithmsDatabase from './GeneticAlgorithmsDatabase'
import { type MutableSimulation, type Simulation } from './types'

const db = new GeneticAlgorithmsDatabase()
let currentSimulationId: number | undefined

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

export const getCurrentSimulation = async (): Promise<Simulation | undefined> => {
  if (currentSimulationId === undefined) return undefined

  return await db.simulations.get(currentSimulationId)
}

export const getAllSimulations = async (): Promise<Simulation[]> => {
  return await db.simulations.toArray()
}

export const getPendingSimulations = async (): Promise<Simulation[]> => {
  return await db.simulations.where('status').equals('pending').toArray()
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
export const runNextPendingSimulation = async (): Promise<Simulation> => {
  const next = await db.simulations.where('status').equals('pending').first()
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
export const insertResultsEntry = async (simulationId: number, results = []) => await db.results.add({
  simulationId,
  createdOn: Date.now(),
  lastUpdated: Date.now(),
  results
})

export const insertResultsForCurrentSimulation = async (results) => (
  await insertResultsEntry(currentSimulationId, results)
)

export const getSimulationResults = async (simulationId: number) => (
  await db.results.get({ simulationId })
)

export const getCurrentSimulationResults = async () => await getSimulationResults(currentSimulationId)

export const addResultsForCurrentSimulation = async (stats) => {
  const entry = await getCurrentSimulationResults()
  const { results } = entry
  results.push(stats)

  return await db.results.update(entry.id, { results })
}

// Images Table
// --------------------------------------------------
export const addImageToDatabase = async (genId, maxFitOrganism) => {
  const { fitness, phenotype, genome: { chromosomes } } = maxFitOrganism

  return await db.images.add({
    gen: genId,
    fitness,
    chromosomes,
    imageData: phenotype,
    simulationId: currentSimulationId
  })
}

export const getImages = async (simulationId) => await db.images.where('simulationId').equals(simulationId).toArray()

export const getCurrentImages = async () => {
  if (currentSimulationId == null) return []

  return await getImages(currentSimulationId)
}

// Gallery Table
// --------------------------------------------------
export const addGalleryEntry = async (simulationId: number, json) => await db.gallery.add({
  createdOn: Date.now(),
  simulationId,
  name: `Entry ${simulationId}`,
  json
})

export const renameGalleryEntry = async (id, name) => await db.gallery.update(id, { name })

export const deleteGalleryEntry = async (id) => { await db.gallery.delete(id) }

// All Tables
// --------------------------------------------------
export const clearDatabase = async () => {
  const promises = []
  const sims = await getAllSimulations()
  sims.forEach(({ id, status }) => {
    if (status === 'running') {
      promises.push(db.simulations.delete(id))
      promises.push(db.images.where('simulationId').equals(id).delete())
    }
  })
  return await Promise.all(promises)
}

// Hooks
// --------------------------------------------------
export const useImageDbQuery = () => useLiveQuery(
  async () => {
    if (currentSimulationId == null) return []

    return await db.images.where('simulationId').equals(currentSimulationId).toArray()
  },
  [currentSimulationId]
)

export const useGetSimulations = (ids) => useLiveQuery(
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

// Database Setup
// --------------------------------------------------
const dbSchema = {}
Object.keys(TableFields).forEach((table) => {
  dbSchema[table] = `++id,${TableFields[table].join()}`
})

db.version(1).stores(dbSchema)
db.open()
clearDatabase()

export default db
