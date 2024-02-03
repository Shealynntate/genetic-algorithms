import gifshot from 'gifshot'
import { type Dim } from './types'
import { canvasParameters } from '../constants/constants'
import { type Phenotype, type Genome, type Point } from '../population/types'

// Internal Helper Functions
// --------------------------------------------------
/**
 * A helper method that asynchronously creates an Image element
 * @param {*} src - the src parameter for an HTML image element to load
 * @returns a Promise that resolves into the created Image object or an error
 */
export const createImage = async (
  src: string
): Promise<HTMLImageElement> => await new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => { resolve(image) }
  image.onerror = (error) => { reject(error) }
  image.src = src
})

/**
 * A helper method that asynchronously creates an Image element from canvas ImageData
 * @param {*} imageData - an ImageData object of canvas pixel data
 * @returns a new Image object whose src data is set to the ImageData provided
 */
const imageDataToImage = async (imageData: ImageData): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  canvas.getContext('2d')?.putImageData(imageData, 0, 0)

  return await createImage(canvas.toDataURL())
}

const scalePoint = (point: Point, { w, h }: Dim): number[] => (
  [point.x * w, point.y * h]
)

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

export const convertBase64ToFile = async (base64: string, fileName: string): Promise<File> => {
  const response = await fetch(base64)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}

export const renderGenomeToCanvas = (
  genome: Genome,
  ctx: CanvasRenderingContext2D,
  { w, h }: Dim
): void => {
  genome.chromosomes.forEach(({ color, points }) => {
    const p0 = scalePoint(points[0], { w, h })
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`
    ctx.beginPath()
    ctx.moveTo(p0[0], p0[1])
    for (let i = 1; i < points.length; ++i) {
      const p = scalePoint(points[i], { w, h })
      ctx.lineTo(p[0], p[1])
    }
    ctx.closePath()
    ctx.fill()
  })
}

export const genomeToPhenotype = (genome: Genome): Phenotype | undefined => {
  const { width, height } = canvasParameters
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  renderGenomeToCanvas(genome, ctx, { w: width, h: height })

  return ctx?.getImageData(0, 0, width, height)
}

export const createGif = async (images: ImageData[]): Promise<string> => {
  const { width, height } = canvasParameters
  const imgs = await Promise.all(images.map(async (image) => (await imageDataToImage(image))))
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
