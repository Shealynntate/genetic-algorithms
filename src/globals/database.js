import Dexie from 'dexie';

const databaseName = 'GA_Images';
const tableName = 'images';

const db = new Dexie(databaseName);

db.version(1).stores(
  { [tableName]: '++id,gen,fitness,imageData' },
);

export function addImageToDatabase(genId, maxFitOrganism) {
  const { fitness, genome: { phenotype } } = maxFitOrganism;

  return db.images.add({
    gen: genId,
    fitness,
    imageData: phenotype,
  });
}

export function clearDatabase() {
  return db.table(tableName).clear();
}

export default db;
