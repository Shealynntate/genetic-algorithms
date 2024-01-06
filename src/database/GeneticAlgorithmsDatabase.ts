import Dexie from 'dexie'
import {
  type Simulation,
  type Image,
  type Results,
  type GalleryEntry
} from './types'

const databaseName = 'GeneticAlgorithmsDB'

class GeneticAlgorithms extends Dexie {
  // Tables
  images!: Dexie.Table<Image, number>
  simulations!: Dexie.Table<Simulation, number>
  results!: Dexie.Table<Results, number>
  gallery!: Dexie.Table<GalleryEntry, number>

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
