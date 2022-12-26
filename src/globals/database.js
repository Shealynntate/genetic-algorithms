import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const databaseName = 'GA_Images';
const imagesTable = 'images';
const statsTable = 'stats';
const simulationTable = 'simulation';

const simulationFields = [
  'isSaved',
  'createdOn',
  'lastUpdated',
  'name',
  // 'population',
  // 'reduxState',
];

const imagesFields = [
  'simulationId',
  'gen',
  // 'fitness',
  // 'chromosomes',
  // 'imageData',
];

const statsFields = [
  'simulationId',
  'genId',
  'isGlobalBest',
  // 'meanFitness',
  // 'maxFitness',
  // 'minFitness',
  // 'deviation',
];

// --------------------------------------------------
let currentSimulationId = '';
const db = new Dexie(databaseName);

db.version(1).stores({
  [simulationTable]: `++id,${simulationFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
  [statsTable]: `++id,${statsFields.join()}`,
});

db.open();

// Simulation Table
// --------------------------------------------------
export async function insertSimulation(population, reduxState) {
  currentSimulationId = await db[simulationTable].add({
    name: 'Unnamed Simulation',
    population,
    reduxState,
    isSaved: 0,
    createdOn: Date.now(),
    lastUpdated: Date.now(),
  });
  return Promise.resolve();
}

export async function getSimulation(id) {
  return db[simulationTable].get(id);
}

export function getAllSimulations() {
  return db.table(simulationTable).toArray();
}

export function updateCurrentSimulation(population, reduxState, isSaved = 1) {
  return db[simulationTable].update(currentSimulationId, {
    population,
    reduxState,
    isSaved,
    lastUpdated: Date.now(),
  });
}

export function renameSimulation(simulationId, name) {
  return db[simulationTable].update(simulationId, { name });
}

export async function setCurrentSimulation(simulationId) {
  const entry = await db[simulationTable].get(simulationId);
  if (!entry) {
    throw new Error(`No entry found for simulationId ${simulationId}`);
  }
  currentSimulationId = simulationId;
  return entry;
}

export async function duplicateSimulation(simId, isSaved = 1) {
  return db.transaction('rw', db[simulationTable], db[imagesTable], db[statsTable], async () => {
    // First get the correct simulation entry
    const simEntry = await db[simulationTable].get(simId);
    const { name, population, reduxState } = Dexie.deepClone(simEntry);
    // Create a copy and insert into the table as a new entry
    const nextId = await db[simulationTable].add({
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
    // Finally, duplicate the stats history for the simulation, using the new simulationId
    const statsData = await db[statsTable].where('simulationId').equals(simId).toArray();
    statsData.forEach(({ id, ...entry }) => {
      db[statsTable].add({ ...Dexie.deepClone(entry), simulationId: nextId });
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
  if (simEntry.id === currentSimulationId) {
    // Don't delete the current Simulation, it'll break things, just mark it as not saved
    return updateCurrentSimulation(simEntry.population, simEntry.reduxState, 0);
  }
  // Delete all matching simulationId entries
  return Promise.all([
    db.table(simulationTable).delete(id),
    db.table(imagesTable).where('simulationId').equals(id).delete(),
    db.table(statsTable).where('simulationId').equals(id).delete(),
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
  return db.table(imagesTable).where('simulationId').equals(currentSimulationId).toArray();
}

export function addStatsToDatabase(stats) {
  return db[statsTable].add({ simulationId: currentSimulationId, ...stats });
}

export function getCurrentStats() {
  return db.table(statsTable).where('simulationId').equals(currentSimulationId).toArray();
}

export async function clearDatabase() {
  const promises = [];
  const sims = await getAllSimulations();
  sims.forEach(({ id, isSaved }) => {
    if (!isSaved) {
      promises.push(db.table(simulationTable).delete(id));
      promises.push(db.table(imagesTable).where('simulationId').equals(id).delete());
      promises.push(db.table(statsTable).where('simulationId').equals(id).delete());
    }
  });
  return Promise.all(promises);
}

// Hooks
export const useImageDbQuery = () => useLiveQuery(
  () => db.table(imagesTable).where('simulationId').equals(currentSimulationId).toArray(),
  [currentSimulationId],
);

export const useGetSavedSimulations = () => useLiveQuery(
  () => db[simulationTable].where('isSaved').equals(1).reverse().toArray(),
);

export default db;
