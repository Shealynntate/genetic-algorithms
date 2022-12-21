import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const databaseName = 'GA_Images';
const imagesTable = 'images';
const statsTable = 'stats';
const simulationTable = 'simulation';

const simulationFields = [
  'isSaved',
  'name',
  'population',
  'reduxState',
  'createdOn',
  'lastUpdated',
];

const imagesFields = [
  'gen',
  'fitness',
  'chromosomes',
  'imageData',
  'simulationId',
];

const statsFields = [
  'genId',
  'meanFitness',
  'maxFitness',
  'minFitness',
  'deviation',
  'isGlobalBest',
  'simulationId',
];

// --------------------------------------------------
let currentSimulationId = '';
const db = new Dexie(databaseName);

db.version(1).stores({
  [simulationTable]: `++id,${simulationFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
  [statsTable]: `++id,${statsFields.join()}`,
});

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
  const [simEntry] = await db[simulationTable].where('id').equals(id).toArray();
  return simEntry;
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
  const [entry] = await db[simulationTable].where('id').equals(simulationId).toArray();
  if (!entry) {
    throw new Error(`No entry found for simulationId ${simulationId}`);
  }
  currentSimulationId = simulationId;
  return entry;
}

export async function duplicateSimulation(simId) {
  const simEntry = await getSimulation(simId);
  const { name, population, reduxState } = Dexie.deepClone(simEntry);

  const nextId = await db[simulationTable].add({
    name: `${name} Copy`,
    population,
    reduxState,
    isSaved: 1,
    createdOn: Date.now(),
    lastUpdated: Date.now(),
  });

  const imageData = await db.table(imagesTable).where('simulationId').equals(simId).toArray();
  imageData.forEach(({ id, ...entry }) => {
    db[imagesTable].add({ ...Dexie.deepClone(entry), simulationId: nextId });
  });

  const statsData = await db.table(statsTable).where('simulationId').equals(simId).toArray();
  statsData.forEach(({ id, ...entry }) => {
    db[statsTable].add({ ...Dexie.deepClone(entry), simulationId: nextId });
  });
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
