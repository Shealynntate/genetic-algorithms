import gifshot from 'gifshot'

import { type Dim } from './types'
import {
  type Chromosome,
  type Phenotype,
  type Genome
} from '../population/types'
import { canvasParameters } from '../simulation/config'

// Internal Helper Functions
// --------------------------------------------------
/**
 * A helper method that asynchronously creates an Image element
 * @param {*} src - the src parameter for an HTML image element to load
 * @returns a Promise that resolves into the created Image object or an error
 */
export const createImage = async (src: string): Promise<HTMLImageElement> =>
  await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    image.src = src
  })

/**
 * A helper method that asynchronously creates an Image element from canvas ImageData
 * @param {*} imageData - an ImageData object of canvas pixel data
 * @returns a new Image object whose src data is set to the ImageData provided
 */
const imageDataToImage = async (
  imageData: ImageData
): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  canvas.getContext('2d')?.putImageData(imageData, 0, 0)

  return await createImage(canvas.toDataURL())
}

const scaleXY = (x: number, y: number, { w, h }: Dim): [number, number] => [
  x * w,
  y * h
]

// Canvas, ImageData and Phenotype Functions
// --------------------------------------------------
export const createImageData = async (
  src: string,
  width: number,
  height: number
): Promise<ImageData> => {
  const image = await createImage(src)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx == null) {
    throw new Error('[createImageData] Could not create canvas context')
  }
  ctx.canvas.width = width
  ctx.canvas.height = height
  ctx.drawImage(image, 0, 0, width, height)

  return ctx.getImageData(0, 0, width, height)
}

export const convertBase64ToFile = async (
  base64: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(base64)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}

const renderChromosome = (
  c: Chromosome,
  ctx: CanvasRenderingContext2D,
  dim: Dim
): void => {
  const { color, points } = c
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
  ctx.beginPath()
  const [x0, y0] = scaleXY(points[0].x, points[0].y, dim)
  ctx.moveTo(x0, y0)
  for (let i = 1; i < points.length; ++i) {
    const [x, y] = scaleXY(points[i].x, points[i].y, dim)
    ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
}

export const renderGenomeToCanvas = (
  genome: Genome,
  ctx: CanvasRenderingContext2D,
  { w, h }: Dim
): void => {
  for (const c of genome.chromosomes) {
    renderChromosome(c, ctx, { w, h })
  }
}

export const genomeToPhenotype = (genome: Genome): Phenotype | undefined => {
  const { width, height } = canvasParameters
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  renderGenomeToCanvas(genome, ctx, { w: width, h: height })

  return ctx?.getImageData(0, 0, width, height)
}

export const createGif = async (images: ImageData[]): Promise<string> => {
  const { width, height } = canvasParameters
  const imgs = await Promise.all(
    images.map(async (image) => await imageDataToImage(image))
  )
  const promise = new Promise<string>((resolve, reject) => {
    gifshot.createGIF(
      {
        images: imgs,
        frameDuration: 3, // 10 = 1.0 seconds
        sampleInterval: 1, // sampling rate for image quality, 1 is best, 10 is default
        gifWidth: width,
        gifHeight: height,
        numFrames: images.length
      },
      ({
        error,
        errorCode,
        errorMsg,
        image // base64 image (gif)
      }) => {
        if (error) {
          console.error(error)
          reject(new Error(`[Gifshot] ${errorCode}: ${errorMsg}`))
        }
        resolve(image)
      }
    )
  })
  return await promise
}
