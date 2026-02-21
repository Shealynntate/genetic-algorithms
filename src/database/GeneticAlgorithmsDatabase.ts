import Dexie from 'dexie'
import { type Gif, type Image, type Results, type Simulation } from './types'

const databaseName = 'GeneticAlgorithmsDB'

class GeneticAlgorithms extends Dexie {
  // Tables
  images!: Dexie.Table<Image, number>
  simulations!: Dexie.Table<Simulation, number>
  results!: Dexie.Table<Results, number>
  gifs!: Dexie.Table<Gif, number>

  constructor() {
    super(databaseName)
    this.version(2).stores({
      gifs: '++id,createdOn,simulationId',
      images: '++id,simulationId,gen',
      results: '++id,simulationId,createdOn',
      simulations: '++id,createdOn,status,name,lastUpdated'
    })
  }
}

export default GeneticAlgorithms
