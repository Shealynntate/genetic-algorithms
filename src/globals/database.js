import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import _ from 'lodash';
import { SimulationStatus } from '../constants';

const databaseName = 'GeneticAlgorithmsDB';

const imagesTable = 'images';
const simulationsTable = 'simulations';
const simulationResultsTable = 'results';
const galleryTable = 'gallery';

const TableFields = {
  [imagesTable]: [
    'simulationId',
    'gen',
    // 'fitness',
    // 'chromosomes',
    // 'imageData',
  ],
  [simulationsTable]: [
    'createdOn',
    'status',
    'name',
    'lastUpdated',
    // 'parameters',
    // 'population',
  ],
  [simulationResultsTable]: [
    'simulationId',
    'createdOn',
    'lastUpdated',
    // 'results',
  ],
  [galleryTable]: [
    'createdOn',
    'simulationId',
    'name',
    // 'json',
  ],
};

const db = new Dexie(databaseName);
let currentSimulationId = null;

// Simulations Table
// --------------------------------------------------
export async function insertSimulation({
  population,
  parameters,
  status = SimulationStatus.UNKNOWN,
}) {
  return db[simulationsTable].add({
    name: 'New Run',
    population,
    parameters,
    status,
    createdOn: Date.now(),
    lastUpdated: Date.now(),
  });
}

export async function getSimulation(id) {
  return db[simulationsTable].get(id);
}

export async function getSimulations(ids) {
  return db[simulationsTable].bulkGet(ids);
}

export async function getCurrentSimulation() {
  return db[simulationsTable].get(currentSimulationId);
}

export function getAllSimulations() {
  return db[simulationsTable].toArray();
}

export const getPendingSimulations = async () => (
  db[simulationsTable].where('status').equals(SimulationStatus.PENDING).toArray()
);

export const updateSimulation = (id, params) => {
  // Whitelist the appropriate data
  const data = _.pick(params, [
    'population',
    'parameters',
    'status',
    'name',
  ]);
  return db[simulationsTable].update(id, {
    lastUpdated: Date.now(),
    ...data,
  });
};

export const updateCurrentSimulation = (params) => updateSimulation(currentSimulationId, params);

export const runNextPendingSimulation = async () => {
  const next = await db[simulationsTable].where('status').equals(SimulationStatus.PENDING).first();
  if (next) {
    currentSimulationId = next.id;
    await updateCurrentSimulation({ status: SimulationStatus.RUNNING });
  }

  return next;
};

export function renameSimulation(simulationId, name) {
  return db[simulationsTable].update(simulationId, { name });
}

export async function setCurrentSimulation(simulationId) {
  if (simulationId == null) {
    // Clear out current simulation state
    currentSimulationId = null;
    return null;
  }

  const entry = await db[simulationsTable].get(simulationId);
  if (!entry) {
    throw new Error(`No entry found for simulationId ${simulationId}`);
  }
  currentSimulationId = simulationId;
  return entry;
}

export async function duplicateSimulation(simId, isSaved = 1) {
  return db.transaction('rw', db[simulationsTable], db[imagesTable], async () => {
    // First get the correct simulation entry
    const simEntry = await db[simulationsTable].get(simId);
    const { name, population, reduxState } = Dexie.deepClone(simEntry);
    // Create a copy and insert into the table as a new entry
    const nextId = await db[simulationsTable].add({
      name,
      population,
      reduxState,
      isSaved,
      createdOn: Date.now(),
      lastUpdated: Date.now(),
    });
    // Next, duplicate the image history for the simulation, using the new simulationId
    const imageData = await db[imagesTable].where('simulationId').equals(simId).toArray();
    imageData.forEach(({ id, ...entry }) => {
      db[imagesTable].add({ ...Dexie.deepClone(entry), simulationId: nextId });
    });

    return nextId;
  });
}

export async function saveCurrentSimulation(population, reduxState) {
  // First update the population values stored in the table
  await updateCurrentSimulation(population, reduxState, 0);
  // Then duplicate it, it'll be marked as saved
  return duplicateSimulation(currentSimulationId);
}

export async function restoreSimulation(simulationId) {
  const newId = await duplicateSimulation(simulationId, 0);
  return setCurrentSimulation(newId);
}

export const deleteSimulation = async (id) => Promise.all([
  // Delete all matching simulationId entries
  db[simulationsTable].delete(id),
  db[imagesTable].where('simulationId').equals(id).delete(),
  db[simulationResultsTable].where('simulationId').equals(id).delete(),
]);

export const deleteCurrentSimulation = async () => {
  if (currentSimulationId == null) {
    throw new Error('Current simulation ID is not set, cannot delete it');
  }
  return deleteSimulation(currentSimulationId);
};

// Simulation Results Table
// --------------------------------------------------
export const insertResultsEntry = (simulationId, results = []) => db[simulationResultsTable].add({
  simulationId,
  createdOn: Date.now(),
  lastUpdated: Date.now(),
  results,
});

export const insertResultsForCurrentSimulation = (results) => (
  insertResultsEntry(currentSimulationId, results)
);

export const getSimulationResults = (simulationId) => (
  db[simulationResultsTable].get({ simulationId })
);

export const getCurrentSimulationResults = () => getSimulationResults(currentSimulationId);

export const addResultsForCurrentSimulation = async (stats) => {
  const entry = await getCurrentSimulationResults();
  const { results } = entry;
  results.push(stats);

  return db[simulationResultsTable].update(entry.id, { results });
};

// Images Table
// --------------------------------------------------
export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, phenotype, genome: { chromosomes } } = maxFitOrganism;

  return db[imagesTable].add({
    gen: genId,
    fitness,
    chromosomes,
    imageData: phenotype,
    simulationId: currentSimulationId,
  });
}

export const getImages = (simulationId) => db[imagesTable].where('simulationId').equals(simulationId).toArray();

export const getCurrentImages = async () => {
  if (currentSimulationId == null) return [];

  return getImages(currentSimulationId);
};

// Gallery Table
// --------------------------------------------------
export const addGalleryEntry = (simulationId, json) => db[galleryTable].add({
  createdOn: Date.now(),
  simulationId,
  name: `Entry ${simulationId}`,
  json,
});

export const renameGalleryEntry = (id, name) => db[galleryTable].update(id, { name });

export const deleteGalleryEntry = (id) => db[galleryTable].delete(id);

// All Tables
// --------------------------------------------------
export async function clearDatabase() {
  const promises = [];
  const sims = await getAllSimulations();
  sims.forEach(({ id, status }) => {
    if (status === SimulationStatus.RUNNING) {
      promises.push(db[simulationsTable].delete(id));
      promises.push(db[imagesTable].where('simulationId').equals(id).delete());
    }
  });
  return Promise.all(promises);
}

// Hooks
// --------------------------------------------------
export const useImageDbQuery = () => useLiveQuery(
  () => {
    if (currentSimulationId == null) return [];

    return db[imagesTable].where('simulationId').equals(currentSimulationId).toArray();
  },
  [currentSimulationId],
);

export const useGetSimulations = (ids) => useLiveQuery(
  () => db[simulationsTable].bulkGet(ids),
);

export const useGetAllSimulation = () => useLiveQuery(
  () => getAllSimulations(),
);

export const useGetCurrentSimulation = () => useLiveQuery(
  () => db[simulationsTable].get({ status: SimulationStatus.RUNNING }),
);

export const useGetCompletedSimulations = () => useLiveQuery(
  () => db[simulationsTable].where('status').equals(SimulationStatus.COMPLETE).toArray(),
);

export const useGetPendingSimulations = () => useLiveQuery(
  () => db[simulationsTable].where('status').equals(SimulationStatus.PENDING).toArray(),
);

export const useGetGalleryEntries = () => useLiveQuery(
  () => db[galleryTable].toArray(),
);

export const useGetAllResults = () => useLiveQuery(
  () => db[simulationResultsTable].toArray(),
);

export const useGetCompletedSimulationsAndResults = () => useLiveQuery(async () => {
  const completedSimulations = await db[simulationsTable].where('status').equals(SimulationStatus.COMPLETE).toArray() || [];
  const results = await db[simulationResultsTable].toArray() || [];

  const findResult = (simId) => {
    const result = results.find((entry) => entry.simulationId === simId);
    return result ? result.results : [];
  };

  return completedSimulations.map((simulation) => (
    { ...simulation, results: findResult(simulation.id) }
  ));
});

// Database Setup
// --------------------------------------------------
const dbSchema = {};
Object.keys(TableFields).forEach((table) => {
  dbSchema[table] = `++id,${TableFields[table].join()}`;
});

db.version(1).stores(dbSchema);
db.open();
clearDatabase();

export default db;
