import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import _ from 'lodash';
import { SimulationStatus } from '../constants';

const databaseName = 'GeneticAlgorithmsDB';
const imagesTable = 'images';
const simulationsTable = 'simulations';

const simulationsFields = [
  'createdOn',
  'status',
  'name',
  'lastUpdated',
  // 'parameters',
  // 'stopCriteria',
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

const db = new Dexie(databaseName);
let currentSimulationId = '';

// Simulations Table
// --------------------------------------------------
export async function insertSimulation({
  population,
  parameters,
  stopCriteria,
  status = SimulationStatus.UNKNOWN,
}) {
  return db[simulationsTable].add({
    name: 'Unnamed Simulation',
    population,
    parameters,
    status,
    stopCriteria,
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
    'stopCriteria',
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

export async function deleteSimulation(id) {
  const simEntry = await getSimulation(id);
  if (simEntry.id === currentSimulationId || simEntry.status === SimulationStatus.RUNNING) {
    // Don't delete the current Simulation, it'll break things, just mark it as not saved
    throw new Error(`Cannot delete a running simulation ${id}`);
  }
  // Delete all matching simulationId entries
  return Promise.all([
    db[simulationsTable].delete(id),
    db[imagesTable].where('simulationId').equals(id).delete(),
  ]);
}

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

export async function getCurrentImages() {
  return db[imagesTable].where('simulationId').equals(currentSimulationId).toArray();
}

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
  () => db[imagesTable].where('simulationId').equals(currentSimulationId).toArray(),
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

// Database Setup
// --------------------------------------------------
db.version(1).stores({
  [simulationsTable]: `++id,${simulationsFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
});

db.open();
clearDatabase();

export default db;
