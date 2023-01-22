import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import _ from 'lodash';
import { SimulationStatus } from '../constants';

const databaseName = 'GeneticAlgorithmsDB';
const imagesTable = 'images';
const simulationsTable = 'simulations';
const galleryTable = 'gallery';

const simulationsFields = [
  'createdOn',
  'status',
  'name',
  'lastUpdated',
  // 'parameters',
  // 'results',
  // 'population',
];

const imagesFields = [
  'simulationId',
  'gen',
  // 'fitness',
  // 'chromosomes',
  // 'imageData',
];

const galleryFields = [
  'createdOn',
  // 'json',
];

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
    results: [],
    createdOn: Date.now(),
    lastUpdated: Date.now(),
  });
}

export async function getSimulation(id) {
  return db[simulationsTable].get(id);
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

export const getNextPendingSimulation = async () => db[simulationsTable].where('status').equals(SimulationStatus.PENDING).first();

export const updateSimulation = (id, params) => {
  // Whitelist the appropriate data
  const data = _.pick(params, [
    'population',
    'parameters',
    'status',
    'name',
    'results',
  ]);
  return db[simulationsTable].update(id, {
    lastUpdated: Date.now(),
    ...data,
  });
};

export const updateCurrentSimulation = (params) => updateSimulation(currentSimulationId, params);

export function renameSimulation(simulationId, name) {
  return db[simulationsTable].update(simulationId, { name });
}

export async function addResultsToCurrentSimulation(entry) {
  const simEntry = await getCurrentSimulation();
  const results = simEntry.results || [];
  results.push(entry);

  return updateCurrentSimulation({ results });
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
]);

export const deleteCurrentSimulation = async () => {
  if (currentSimulationId == null) {
    throw new Error('Current simulation ID is not set, cannot delete it');
  }
  return deleteSimulation(currentSimulationId);
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
export const addGalleryEntry = (json) => db[galleryTable].add({
  createdOn: Date.now(),
  json,
});

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

export const useGetCurrentSimulation = () => useLiveQuery(
  () => db[simulationsTable].get({ status: SimulationStatus.RUNNING }),
);

export const useGetCompletedSimulations = () => useLiveQuery(
  () => db[simulationsTable].where('status').equals(SimulationStatus.COMPLETE).toArray(),
);

export const useGetPendingSimulations = () => useLiveQuery(
  () => db[simulationsTable].where('status').equals(SimulationStatus.PENDING).toArray(),
);

export const useGetSavedSimulations = () => useLiveQuery(
  () => db[simulationsTable].where('isSaved').equals(1).reverse().toArray(),
);

export const useGetGalleryEntries = () => useLiveQuery(
  () => db[galleryTable].toArray(),
);

// Database Setup
// --------------------------------------------------
db.version(1).stores({
  [simulationsTable]: `++id,${simulationsFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
  [galleryTable]: `++id,${galleryFields.join()}`,
});

db.open();
clearDatabase();

export default db;
