import { deviation } from 'd3-array';
import { flatten } from 'lodash';
import Organism from './organism';
import { canvasParameters, SelectionType } from '../constants';
import { randomFloat, randomIndex } from '../globals/statsUtils';
import WorkerBuilder from '../web-workers/workerBuilder';
import phenotypeWorker from '../web-workers/phenotypeWorker';
import { genRange } from '../globals/utils';

const { width, height } = canvasParameters;
const options = { height, width };
const getCanvas = () => {
  const canvas = document.createElement('canvas', options);
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const workerA = new WorkerBuilder(phenotypeWorker);
const canvasA = getCanvas();
const canvasWorkerA = canvasA.transferControlToOffscreen();
workerA.postMessage({
  canvas: canvasWorkerA,
  width,
  height,
}, [canvasWorkerA]);

const workerB = new WorkerBuilder(phenotypeWorker);
const canvasB = getCanvas();
const canvasWorkerB = canvasB.transferControlToOffscreen();
workerB.postMessage({
  canvas: canvasWorkerB,
  width,
  height,
}, [canvasWorkerB]);

const workerC = new WorkerBuilder(phenotypeWorker);
const canvasC = getCanvas();
const canvasWorkerC = canvasC.transferControlToOffscreen();
workerC.postMessage({
  canvas: canvasWorkerC,
  width,
  height,
}, [canvasWorkerC]);

const workerD = new WorkerBuilder(phenotypeWorker);
const canvasD = getCanvas();
const canvasWorkerD = canvasD.transferControlToOffscreen();
workerD.postMessage({
  canvas: canvasWorkerD,
  width,
  height,
}, [canvasWorkerD]);

class Population {
  static get nextGenId() {
    Population.count = Population.count == null ? 0 : Population.count + 1;
    return Population.count;
  }

  // Instance Methods
  // ------------------------------------------------------------
  constructor(size, genomeSize, target) {
    this.genId = Population.nextGenId;
    this.target = target;
    this.organisms = [...Array(size)].map(() => Organism.create({ size: genomeSize }));
    workerA.postMessage({
      target,
    });
    workerB.postMessage({
      target,
    });
    workerC.postMessage({
      target,
    });
    workerD.postMessage({
      target,
    });
  }

  async init() {
    // Prep for the first call of runGeneration
    this.organisms = await this.generatePhenotypes();
    // this.organisms = await this.evaluateFitness();
  }

  async runGeneration(selectionType, eliteCount, crossoverProb, mutationNoise) {
    // console.time('Run Selection');
    const count = (this.size - eliteCount) / 2;
    const parents = this.performSelection(selectionType, count);
    // Replace old population with new generation
    this.organisms = this.reproduce(parents, eliteCount, crossoverProb, mutationNoise);
    this.genId = Population.nextGenId;
    // console.timeEnd('Run Selection');
    // console.time('Run Evaluate Fitness');
    this.organisms = await this.generatePhenotypes();
    // this.organisms = await this.evaluateFitness();
    // console.timeEnd('Run Evaluate Fitness');
    // console.time('Create Node');
    return this.createStats();
    // console.timeEnd('Create Node');
  }

  async generatePhenotypes() {
    const results = await Promise.all([new Promise((resolve, reject) => {
      try {
        workerA.postMessage({
          organisms: this.organisms.slice(0, this.size / 4),
        });
        workerA.onmessage = (result) => {
          resolve(result.data);
          // Population.worker.terminate();
        };
      } catch (error) {
        reject(error);
      }
    }),
    new Promise((resolve, reject) => {
      try {
        workerB.postMessage({
          organisms: this.organisms.slice(this.size / 4, this.size / 2),
        });
        workerB.onmessage = (result) => {
          resolve(result.data);
        };
      } catch (error) {
        reject(error);
      }
    }),
    new Promise((resolve, reject) => {
      try {
        workerC.postMessage({
          organisms: this.organisms.slice(this.size / 2, (this.size * 3) / 4),
        });
        workerC.onmessage = (result) => {
          resolve(result.data);
        };
      } catch (error) {
        reject(error);
      }
    }),
    new Promise((resolve, reject) => {
      try {
        workerD.postMessage({
          organisms: this.organisms.slice((this.size * 3) / 4),
        });
        workerD.onmessage = (result) => {
          resolve(result.data);
        };
      } catch (error) {
        reject(error);
      }
    }),
    ]);
    let orgs = [];
    for (let i = 0; i < results.length; ++i) {
      orgs = orgs.concat(results[i].results);
    }
    console.log(orgs.length);
    return flatten(orgs);
  }

  /**
   * Evaluates the fitness of each organism in the population
   * Should only be called per generation as it's compulationally expensive
   * @returns null
   */
  // async evaluateFitness() {
  //   // Have each Organism compute its fitness score
  //   this.organisms.forEach((org) => Organism.evaluateFitness(org, this.target));
  //   const results = await Promise.all([new Promise((resolve, reject) => {
  //     try {
  //       fitnessWorkerA.postMessage({
  //         organisms: this.organisms.slice(0, this.size / 4),
  //         target: this.target,
  //       });
  //       fitnessWorkerA.onmessage = (result) => {
  //         resolve(result.data);
  //         // Population.worker.terminate();
  //       };
  //     } catch (error) {
  //       reject(error);
  //     }
  //   }),
  //   new Promise((resolve, reject) => {
  //     try {
  //       fitnessWorkerB.postMessage({
  //         organisms: this.organisms.slice(this.size / 4, this.size / 2),
  //         target: this.target,
  //       });
  //       fitnessWorkerB.onmessage = (result) => {
  //         resolve(result.data);
  //       };
  //     } catch (error) {
  //       reject(error);
  //     }
  //   }),
  //   new Promise((resolve, reject) => {
  //     try {
  //       fitnessWorkerC.postMessage({
  //         organisms: this.organisms.slice(this.size / 2, (this.size * 3) / 4),
  //         target: this.target,
  //       });
  //       fitnessWorkerC.onmessage = (result) => {
  //         resolve(result.data);
  //       };
  //     } catch (error) {
  //       reject(error);
  //     }
  //   }),
  //   new Promise((resolve, reject) => {
  //     try {
  //       fitnessWorkerD.postMessage({
  //         organisms: this.organisms.slice((this.size * 3) / 4),
  //         target: this.target,
  //       });
  //       fitnessWorkerD.onmessage = (result) => {
  //         resolve(result.data);
  //       };
  //     } catch (error) {
  //       reject(error);
  //     }
  //   }),
  //   ]);
  //   let orgs = [];
  //   for (let i = 0; i < results.length; ++i) {
  //     orgs = orgs.concat(results[i].results);
  //   }
  //   console.log(orgs.length);
  //   return flatten(orgs);
  // }

  performSelection(selectionType, count) {
    const tournamentSize = 2;
    switch (selectionType) {
      case SelectionType.ROULETTE:
        return this.rouletteSelection(count);
      case SelectionType.TOURNAMENT:
        return this.tournamentSelection(count, tournamentSize);
      case SelectionType.SUS:
        return this.susSelection(count);
      default:
        throw new Error(`[Population] Invalid SelectionType ${selectionType} provided`);
    }
  }

  reproduce(parents, eliteCount, crossoverProb, mutationNoise) {
    // Generate (N - eliteCount) offspring for the next generation
    const nextGen = this.getElites(eliteCount);
    parents.forEach(([p1, p2]) => {
      const offspring = Organism.reproduce(p1, p2, crossoverProb, mutationNoise);
      nextGen.push(...offspring);
    });
    return nextGen;
  }

  // Parent Selection Algorithms
  // ------------------------------------------------------------
  rouletteSelection(count) {
    const parents = [];
    const cdf = this.createFitnessCDF();
    while (parents.length < count) {
      const p1 = this.rouletteSelectParent(cdf);
      const p2 = this.rouletteSelectParent(cdf);
      parents.push([p1, p2]);
    }
    return parents;
  }

  tournamentSelection(count, tournamentSize) {
    const parents = [];
    while (parents.length < count) {
      const p1 = this.tournamentSelectParent(tournamentSize);
      const p2 = this.tournamentSelectParent(tournamentSize);
      parents.push([p1, p2]);
    }
    return parents;
  }

  susSelection(count) {
    const parents = [];
    const cdf = this.createFitnessCDF();
    const step = cdf[cdf.length - 1] / this.size;
    let value = randomFloat(0, step);
    while (parents.length < count) {
      const p1 = this.susSelectParent(value);
      value += step;
      const p2 = this.susSelectParent(value);
      value += step;
      parents.push([p1, p2]);
    }
    return parents;
  }

  // Parent Selection Algorithm Helpers
  // ------------------------------------------------------------
  rouletteSelectParent(cdf) {
    const total = cdf[cdf.length - 1];
    const n = randomFloat(0, total);
    const index = cdf.findIndex((f) => n <= f);
    return this.organisms[index];
  }

  tournamentSelectParent(size) {
    let best = this.randomOrganism();
    genRange(size).forEach(() => {
      const next = this.randomOrganism();
      if (next.fitness > best.fitness) {
        best = next;
      }
    });

    return best;
  }

  susSelectParent(cdf, value) {
    const index = cdf.findIndex((f) => value <= f);
    return this.organisms[index];
  }

  createFitnessCDF() {
    const cdf = [];
    let fitnessSum = 0;
    this.organisms.forEach((org) => {
      fitnessSum += org.fitness;
      cdf.push(fitnessSum);
    });
    return cdf;
  }

  getElites(count) {
    if (count === 0) return [];

    const organisms = this.organismsByFitness();
    return organisms.slice(0, count).map((org) => org.clone());
  }

  randomOrganism() {
    const index = randomIndex(this.size);
    return this.organisms[index];
  }

  maxFitOrganism() {
    return this.organismsByFitness()[0];
  }

  // Helper Methods
  // ------------------------------------------------------------
  /**
   * Sorts a copy of the list of organisms by fitness in descending order.
   * @returns the array of sorted organisms
   */
  organismsByFitness() {
    return [...this.organisms].sort((a, b) => b.fitness - a.fitness);
  }

  createStats() {
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let total = 0;
    let maxFitOrganism = null;
    for (let i = 0; i < this.size; ++i) {
      const { fitness } = this.organisms[i];
      if (fitness < min) min = fitness;
      if (fitness > max) {
        max = fitness;
        maxFitOrganism = this.organisms[i];
      }
      total += fitness;
    }
    const mean = total / this.size;

    return {
      id: this.genId,
      meanFitness: mean,
      maxFitness: max,
      minFitness: min,
      deviation: deviation(this.organisms, (o) => o.fitness),
      maxFitOrganism,
    };
  }

  /**
   * The size of the population (number of organisms per generation)
   */
  get size() {
    return this.organisms.length;
  }
}

export default Population;
