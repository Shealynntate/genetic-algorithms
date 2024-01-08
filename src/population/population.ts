import { deviation } from 'd3-array'
import { omit } from 'lodash'
import {
  type RestorePopulationParameters,
  type PopulationParameters,
  type Organism,
  type FitnessEvaluator
} from './types'
import { statsSigFigs } from '../constants/constants'
import { genRange, setSigFigs } from '../utils/utils'
import { randomFloat, randomIndex } from '../utils/statsUtils'
import Mutation from './mutationModel'
import Selection from './selection'
import Crossover from './crossoverModel'
import OrganismModel from './organismModel'

class Population {
  // Static Properties
  // ------------------------------------------------------------
  static count: number = -1

  // Instance Properties
  // ------------------------------------------------------------
  genId: number
  target: string
  maxGenomeSize: number
  maxPoints: number
  minPoints: number
  crossover: Crossover
  mutation: Mutation
  selection: Selection
  organisms: Organism[]
  best: Organism | null
  evaluateFitness: FitnessEvaluator

  // Static Methods
  // ------------------------------------------------------------
  static get nextGenId (): number {
    Population.count += 1

    return Population.count
  }

  static restorePopulation (
    parameters: PopulationParameters,
    evaluateFitness: FitnessEvaluator,
    restoreParameters: RestorePopulationParameters
  ): Population {
    Population.count = restoreParameters.genId
    OrganismModel.restoreId(restoreParameters.organismId)

    const population = new Population(parameters, evaluateFitness)
    population.organisms = restoreParameters.organisms
    population.best = restoreParameters.best

    return population
  }

  static reset (): void {
    Population.count = -1
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor (parameters: PopulationParameters, evaluateFitness: FitnessEvaluator) {
    this.genId = Population.nextGenId
    this.target = parameters.target
    this.crossover = new Crossover(parameters.crossover)
    this.selection = new Selection(parameters.selection)
    this.mutation = new Mutation(parameters.mutation)
    this.maxGenomeSize = parameters.maxGenomeSize
    this.minPoints = parameters.minPoints
    this.maxPoints = parameters.maxPoints
    this.evaluateFitness = evaluateFitness
    this.best = null
    this.organisms = [...Array(parameters.size)].map(
      () => OrganismModel.create({ size: parameters.minGenomeSize, numSides: parameters.minPoints })
    )
    // If population is shrinking, keep the first <size> organisms
    // If fitness has been evaluated, then they're the most fit, otherwise it's a random selection
    if (this.organisms.length > parameters.size) {
      this.organisms = this.organisms.slice(0, parameters.size)
    }
    // If the population is expanding, duplicate the first organism until we reach <size>
    // It's either the most fit organism or a random selection
    while (this.organisms.length < parameters.size) {
      // Clone and mutate first organism
      this.organisms.push(OrganismModel.cloneAndMutate(this.organisms[0], this.mutation))
    }
  }

  serialize () {
    const { best } = this
    if (best) {
      best.organism = omit(best.organism, ['phenotype'])
    }
    return {
      genId: this.genId,
      organisms: this.organisms.map((o) => omit(o, ['phenotype'])),
      mutation: this.mutation.serialize(),
      crossover: this.crossover.serialize(),
      selection: this.selection.serialize(),
      best,
      organismId: Organism.getLatestId()
    }
  }

  async initialize (): Promise<void> {
    // Prep for the first call of runGeneration
    this.organisms = await this.evaluateFitness(this.organisms)
  }

  async runGeneration () {
    const parents = this.performSelection(this.selection)
    this.organisms = this.reproduce(parents, this.selection, this.crossover, this.mutation)
    // This is handled externally in a webWorker in order to parallelize the work
    this.organisms = await this.evaluateFitness(this.organisms)

    this.genId = Population.nextGenId
    const stats = this.createStats()
    // Let Mutation and Crossover strategies update if needed
    this.mutation.markNextGen(stats)
    this.crossover.markNextGen(stats)

    return stats
  }

  performSelection ({ type, tournamentSize, eliteCount }) {
    const count = (this.size - eliteCount) / 2
    switch (type) {
      case SelectionType.ROULETTE:
        return this.rouletteSelection(count)
      case SelectionType.TOURNAMENT:
        return this.tournamentSelection(count, tournamentSize)
      case SelectionType.SUS:
        return this.susSelection(count)
      default:
        throw new Error(`Invalid SelectionType ${type} provided`)
    }
  }

  reproduce (parents, selection, crossover, mutation) {
    const { eliteCount } = selection
    // Generate (N - eliteCount) offspring for the next generation
    const nextGen = this.getElites(eliteCount)
    const bounds = {
      maxGenomeSize: this.maxGenomeSize,
      minPoints: this.minPoints,
      maxPoints: this.maxPoints
    }
    parents.forEach(([p1, p2]) => {
      const offspring = Organism.reproduce(p1, p2, crossover, mutation, bounds)
      nextGen.push(...offspring)
    })
    return nextGen
  }

  // Parent Selection Algorithms
  // ------------------------------------------------------------
  rouletteSelection (count) {
    const parents = []
    const cdf = this.createFitnessCDF()
    while (parents.length < count) {
      const p1 = this.rouletteSelectParent(cdf)
      const p2 = this.rouletteSelectParent(cdf)
      parents.push([p1, p2])
    }
    return parents
  }

  tournamentSelection (count, tournamentSize) {
    const parents = []
    while (parents.length < count) {
      const p1 = this.tournamentSelectParent(tournamentSize)
      const p2 = this.tournamentSelectParent(tournamentSize)
      parents.push([p1, p2])
    }
    return parents
  }

  susSelection (count) {
    const parents = []
    const cdf = this.createFitnessCDF()
    const step = cdf[cdf.length - 1] / this.size
    let value = randomFloat(0, step)
    while (parents.length < count) {
      const p1 = this.susSelectParent(cdf, value)
      value += step
      const p2 = this.susSelectParent(cdf, value)
      value += step
      parents.push([p1, p2])
    }
    return parents
  }

  // Parent Selection Algorithm Helpers
  // ------------------------------------------------------------
  rouletteSelectParent (cdf) {
    const total = cdf[cdf.length - 1]
    const n = randomFloat(0, total)
    let index = 0
    for (let i = 1; i < cdf.length; ++i) {
      if (cdf[i - 1] < n && cdf[i] >= n) {
        index = i
        break
      }
    }

    return this.organisms[index]
  }

  tournamentSelectParent (size) {
    let best = this.randomOrganism()
    let fitA = best.fitness
    genRange(size).forEach(() => {
      const next = this.randomOrganism()
      const fitB = next.fitness
      if (fitB > fitA) {
        best = next
        fitA = fitB
      }
    })

    return best
  }

  susSelectParent (cdf, value) {
    const index = cdf.findIndex((f) => value <= f)
    return this.organisms[index]
  }

  createFitnessCDF () {
    const cdf = []
    let fitnessSum = 0
    this.organisms.forEach((org) => {
      fitnessSum += org.fitness
      cdf.push(fitnessSum)
    })
    return cdf
  }

  getElites (count) {
    if (count === 0) return []

    const organisms = this.organismsByFitness()
    return organisms.slice(0, count).map((org) => Organism.clone(org))
  }

  randomOrganism () {
    const index = randomIndex(this.size)
    return this.organisms[index]
  }

  maxFitOrganism () {
    return this.organismsByFitness()[0]
  }

  // Helper Methods
  // ------------------------------------------------------------
  /**
   * Sorts a copy of the list of organisms by fitness in descending order.
   * @returns the array of sorted organisms
   */
  organismsByFitness () {
    return [...this.organisms].sort((a, b) => b.fitness - a.fitness)
  }

  createStats () {
    let max = Number.MIN_SAFE_INTEGER
    let min = Number.MAX_SAFE_INTEGER
    let total = 0
    let maxFitOrganism = null
    for (let i = 0; i < this.size; ++i) {
      const { fitness } = this.organisms[i]
      if (fitness < min) min = fitness
      if (fitness > max) {
        max = fitness
        maxFitOrganism = this.organisms[i]
      }
      total += fitness
    }
    const mean = total / this.size
    // Update the overall best organism
    let isGlobalBest = false
    if (!this.best || max > this.best.organism.fitness) {
      this.best = { genId: this.genId, organism: maxFitOrganism }
      isGlobalBest = true
    }
    return {
      genId: this.genId,
      meanFitness: setSigFigs(mean, statsSigFigs),
      maxFitness: setSigFigs(max, statsSigFigs),
      minFitness: setSigFigs(min, statsSigFigs),
      deviation: setSigFigs(deviation(this.organisms, (o) => o.fitness), statsSigFigs),
      maxFitOrganism,
      isGlobalBest
    }
  }

  /**
   * The size of the population (number of organisms per generation)
   */
  get size () {
    return this.organisms.length
  }
}

export default Population
