import Dexie from 'dexie'
import {
  type SimulationDbEntry,
  type ImagesDbEntry,
  type ResultsDbEntry,
  type GalleryDbEntry
} from './types'

const databaseName = 'GeneticAlgorithmsDB'

class GeneticAlgorithms extends Dexie {
  // Tables
  images!: Dexie.Table<ImagesDbEntry, number>
  simulations!: Dexie.Table<SimulationDbEntry, number>
  results!: Dexie.Table<ResultsDbEntry, number>
  gallery!: Dexie.Table<GalleryDbEntry, number>

  constructor () {
    super(databaseName)
    this.version(1).stores({
      images: '++id,simulationId,gen',
      simulations: '++id,createdOn,status,name,lastUpdated',
      results: '++id,simulationId,createdOn,lastUpdated',
      gallery: '++id,createdOn,simulationId,name'
    })
  }
}

export default GeneticAlgorithms
