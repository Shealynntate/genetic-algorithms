import Dexie from 'dexie'
import { type Simulation, type Image, type Results } from './types'
import { type GalleryEntryData } from '../gallery/types'

const databaseName = 'GeneticAlgorithmsDB'

class GeneticAlgorithms extends Dexie {
  // Tables
  images!: Dexie.Table<Image, number>
  simulations!: Dexie.Table<Simulation, number>
  results!: Dexie.Table<Results, number>
  gallery!: Dexie.Table<GalleryEntryData, number>

  constructor () {
    super(databaseName)
    this.version(2).stores({
      images: '++id,simulationId,gen',
      simulations: '++id,createdOn,status,name,lastUpdated',
      results: '++id,simulationId,createdOn,lastUpdated',
      gallery: '++id,createdOn,simulationId,name'
    })
  }
}

export default GeneticAlgorithms
