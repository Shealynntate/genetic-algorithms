import { createContext } from 'react'

import OrganismModel from './organismModel'
import PopulationModel from './populationModel'
import {
  type Population,
  type PopulationParameters,
  type Organism,
  type WorkerMessage
} from './types'
import { workerBatchSize } from '../parameters/config'
import { canvasParameters } from '../simulation/config'
import { createImageData } from '../utils/imageUtils'
import createWorker from '../web-workers/fitnessEvaluatorCreator'

/**
 * A class that serves as the interface between the App and the Population
 * and other GA model code that's designed to be platform agnostic.
 * This service has methods for creating, destroying, and running a Population.
 * It also manages the webWorker code for parallelizing the fitnessEvaluation work.
 */
class PopulationService {
  population: PopulationModel | null
  workers: Worker[]

  constructor() {
    this.population = null
    this.workers = []
  }

  async create(parameters: PopulationParameters): Promise<PopulationModel> {
    const { size, target } = parameters
    const imageData = await createImageData(
      target,
      canvasParameters.width,
      canvasParameters.height
    )
    // Setup web workers for evaluateFitness work
    const numWorkers = Math.ceil(size / workerBatchSize)
    this.workers = [...Array(numWorkers)].map(() =>
      createWorker(imageData.data)
    )
    this.population = new PopulationModel(
      parameters,
      this.evaluateFitness.bind(this)
    )
    await this.population.initialize()

    return this.population
  }

  async restore(
    state: Population,
    minGenomeSize: number,
    maxGenomeSize: number
  ): Promise<PopulationModel> {
    const { genId, organismId, organisms, best, ...parameters } = state
    this.population = PopulationModel.restorePopulation(
      { minGenomeSize, maxGenomeSize, ...parameters },
      {
        genId,
        organismId,
        organisms,
        best
      },
      this.evaluateFitness.bind(this)
    )
    await this.population.initialize()

    return this.population
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns the array of evaluated Organisms
   */
  async evaluateFitness(organisms: Organism[]): Promise<Organism[]> {
    const size = organisms.length
    const promises: Promise<{ fitnesses: Float64Array; start: number }>[] = []

    for (let i = 0; i < this.workers.length; ++i) {
      const start = i * workerBatchSize
      const end = Math.min((i + 1) * workerBatchSize, size)
      promises.push(
        new Promise((resolve, reject) => {
          try {
            this.workers[i].postMessage({
              organisms: organisms.slice(start, end)
            })
            this.workers[i].onmessage = (result: MessageEvent<WorkerMessage>) => {
              resolve({ fitnesses: result.data.fitnesses, start })
            }
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)))
          }
        })
      )
    }

    // B7+B8: Assign fitness values in place — no organism reconstruction needed
    const results = await Promise.all(promises)
    for (const { fitnesses, start } of results) {
      for (let j = 0; j < fitnesses.length; j++) {
        organisms[start + j].fitness = fitnesses[j]
      }
    }
    return organisms
  }

  serialize(): Population | undefined {
    return this.population?.serialize()
  }

  reset(): void {
    // Reset the static state of the Population
    PopulationModel.reset()
    OrganismModel.reset()
    this.population = null
    // Terminate the webWorkers
    this.workers.forEach((worker) => {
      worker.terminate()
    })
    this.workers = []
  }

  getPopulation(): PopulationModel | null {
    return this.population
  }
}

const populationService = new PopulationService()

export const PopulationContext = createContext(populationService)

export type PopulationServiceType = typeof populationService

export default populationService
