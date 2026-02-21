import {
  canvasParameters,
  maxColorValue,
  numColorChannels
} from '../simulation/config'

const { width, height } = canvasParameters

const createWorker = (target: Uint8ClampedArray): Worker => {
  // Create a new worker
  const worker = new Worker(new URL('./fitnessEvaluator.ts', import.meta.url), {
    type: 'module'
  })
  // Create a canvas to transfer to the worker
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const canvasWorker = canvas.transferControlToOffscreen()
  // Post an init message to the worker
  worker.postMessage(
    {
      canvas: canvasWorker,
      numColorChannels,
      maxColorValue,
      target
    },
    [canvasWorker]
  )

  return worker
}

export default createWorker
