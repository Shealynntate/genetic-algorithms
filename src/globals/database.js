import Dexie from 'dexie';

const databaseName = 'GA_Images';
const metadataTable = 'metadata';
const imagesTable = 'images';
const statsTable = 'stats';

const metadataFields = [
  'triangleCount',
  'selectionType',
  'populationSize',
  'eliteCount',
  'mutation',
];

const imagesFields = [
  'metadataId',
  'gen',
  'fitness',
  'dna',
  'imageData',
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

// --------------------------------------------------
let currentMetadataId = '';
const db = new Dexie(databaseName);

db.version(1).stores({
  [metadataTable]: `++id,${metadataFields.join()}`,
  [imagesTable]: `++id,${imagesFields.join()}`,
  [statsTable]: `++id,${statsFields.join()}`,
});

export async function initializeDBEntry({
  triangleCount,
  populationSize,
  selection,
  mutation,
}) {
  currentMetadataId = await db[metadataTable].add({
    triangleCount,
    selection,
    populationSize,
    mutation,
  });
  return Promise.resolve();
}

export const getCurrentMetadata = async () => db.table(metadataTable).get(currentMetadataId);

export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, phenotype, genome: { dna } } = maxFitOrganism;

  return db[imagesTable].add({
    gen: genId,
    fitness,
    dna,
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

export function clearDatabase() {
  return Promise.all([
    db.table(imagesTable).clear(),
    db.table(metadataTable).clear(),
    db.table(statsTable).clear(),
  ]);
}

export default db;
