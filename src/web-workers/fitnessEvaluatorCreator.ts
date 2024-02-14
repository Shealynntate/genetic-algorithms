import WorkerBuilder from './workerBuilder'
import fitnessEvaluator from './fitnessEvaluator'
import { canvasParameters, maxColorValue, numColorChannels } from '../simulation/config'

const { width, height } = canvasParameters

const createWorker = (target: Uint8ClampedArray): WorkerBuilder => {
  // Create a new worker
  const worker = new WorkerBuilder(fitnessEvaluator as unknown as string)
  // Create a canvas to transfer to the worker
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const canvasWorker = canvas.transferControlToOffscreen()
  // Post an init message to the worker
  worker.postMessage({
    canvas: canvasWorker,
    numColorChannels,
    maxColorValue,
    target
  }, [canvasWorker])

  return worker
}

export default createWorker
