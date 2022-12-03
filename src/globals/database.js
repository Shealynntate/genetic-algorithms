import Dexie from 'dexie';

const databaseName = 'GA_Images';
const tableName = 'images';

const db = new Dexie(databaseName);

db.version(1).stores(
  { [tableName]: '++id,gen,fitness,dna,imageData' },
);

export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, genome: { phenotype, dna } } = maxFitOrganism;

  return db.images.add({
    gen: genId,
    fitness,
    dna,
    imageData: phenotype,
  });
}

export async function getImages() {
  return db.table(tableName).toArray();
}

export function clearDatabase() {
  return db.table(tableName).clear();
}

export default db;
