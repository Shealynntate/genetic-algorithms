import Dexie from 'dexie';

const databaseName = 'GA_Images';
const metadataTable = 'metadata';
const imagesTable = 'images';

const db = new Dexie(databaseName);

db.version(1).stores({
  [metadataTable]: '++id,triangleCount,selectionType,populationSize,eliteCount,mutation',
  [imagesTable]: '++id,metadataId,gen,fitness,dna,imageData',
});

let currentMetadataId;

export async function initializeDBEntry({
  triangleCount,
  selectionType,
  populationSize,
  eliteCount,
  mutation,
}) {
  currentMetadataId = await db[metadataTable].add({
    triangleCount,
    selectionType,
    populationSize,
    eliteCount,
    mutation,
  });
  return Promise.resolve();
}

export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, genome: { phenotype, dna } } = maxFitOrganism;

  return db[imagesTable].add({
    gen: genId,
    fitness,
    dna,
    imageData: phenotype,
    metadataId: currentMetadataId,
  });
}

export const getCurrentMetadata = async () => db.table(metadataTable).get(currentMetadataId);

export async function getCurrentImages() {
  return db.table(imagesTable).where('metadataId').equals(currentMetadataId).toArray();
}

export function clearDatabase() {
  return Promise.all([
    db.table(imagesTable).clear(),
    db.table(metadataTable).clear(),
  ]);
}

export default db;
