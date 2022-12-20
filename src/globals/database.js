import Dexie from 'dexie';

const databaseName = 'GA_Images';
const parametersTable = 'parameters';
const imagesTable = 'images';
const statsTable = 'stats';
const simulationTable = 'simulation';

const parametersFields = [
  'triangleCount',
  'selectionType',
  'populationSize',
  'eliteCount',
  'mutation',
  'metadataId',
];

const imagesFields = [
  'gen',
  'fitness',
  'chromosomes',
  'imageData',
  'metadataId',
];

const statsFields = [
  'genId',
  'meanFitness',
  'maxFitness',
  'minFitness',
  'deviation',
  'isGlobalBest',
  'metadataId',
];

const simulationFields = [
  'population',
  'reduxState',
  'metadataId',
];

// --------------------------------------------------
let currentMetadataId = '';
const db = new Dexie(databaseName);

db.version(1).stores({
  [parametersTable]: `++id,${parametersFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
  [statsTable]: `++id,${statsFields.join()}`,
  [simulationFields]: `++id${simulationFields.join()}`,
});

export async function initializeDBEntry({
  triangleCount,
  populationSize,
  selection,
  mutation,
}) {
  currentMetadataId = await db[parametersTable].add({
    triangleCount,
    selection,
    populationSize,
    mutation,
    metadataId: currentMetadataId,
  });
  return Promise.resolve();
}

export const getCurrentParameters = async () => db.table(parametersTable).get(currentMetadataId);

export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, phenotype, genome: { chromosomes } } = maxFitOrganism;

  return db[imagesTable].add({
    gen: genId,
    fitness,
    chromosomes,
    imageData: phenotype,
    metadataId: currentMetadataId,
  });
}

export async function getCurrentImages() {
  return db.table(imagesTable).where('metadataId').equals(currentMetadataId).toArray();
}

export function addStatsToDatabase(stats) {
  return db[statsTable].add({ metadataId: currentMetadataId, ...stats });
}

export function getCurrentStats() {
  return db.table(statsTable).where('metadataId').equals(currentMetadataId).toArray();
}

// Simulation Table
export function saveCurrentSimulation(population, reduxState) {
  return db[simulationTable].add({
    population,
    reduxState,
    metadataId: currentMetadataId,
  });
}

export function getAllSimulations() {
  return db.table(simulationTable).toArray();
}

export function deleteSimulation(id) {
  return db.table(simulationTable).delete(id);
}

export function setCurrentSimulation(metadataId) {
  currentMetadataId = metadataId;
}

export function clearDatabase() {
  return Promise.all([
    db.table(imagesTable).clear(),
    db.table(parametersTable).clear(),
    db.table(statsTable).clear(),
  ]);
}

export default db;
