import { type Organism, type Chromosome } from '../population/types'

interface Input {
  data: InputContent
}

interface InputContent {
  canvas: HTMLCanvasElement
  organisms: Organism[]
  numColorChannels: number
  maxColorValue: number
  target: Uint8ClampedArray
}

export default (): void => {
  let fitnessEvaluator: FitnessEvaluator | null = null

  class FitnessEvaluator {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    target: Uint8ClampedArray
    denominator: number

    constructor (canvas: HTMLCanvasElement, numColorChannels: number, maxColorValue: number, target: Uint8ClampedArray) {
      this.ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
      this.width = canvas.width
      this.height = canvas.height
      this.target = target
      this.denominator = maxColorValue * numColorChannels * this.width * this.height
    }

    getImageData (chromosomes: Chromosome[]): ImageData {
      this.ctx.clearRect(0, 0, this.width, this.height)

      chromosomes.forEach(({ color, points }) => {
        this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
        this.ctx.beginPath()
        this.ctx.moveTo(points[0][0] * this.width, points[0][1] * this.height)
        for (let i = 1; i < points.length; ++i) {
          this.ctx.lineTo(points[i][0] * this.width, points[i][1] * this.height)
        }
        this.ctx.closePath()
        this.ctx.fill()
      })

      return this.ctx.getImageData(0, 0, this.width, this.height)
    }

    evaluateFitness (p: ImageData): number {
      const pixels = p.data
      if (pixels.length !== this.target.length) {
        throw new Error(`Target length ${this.target.length} does not match phenotype length ${pixels.length}`)
      }

      let difference = 0
      // Note: This for-loop is an order of magnitude faster than Array.prototype.forEach
      // Super important here since each length is tens of thousands of pixels per organism
      for (let i = 0; i < pixels.length; i++) {
        difference += Math.abs(pixels[i] - this.target[i])
      }

      return (1 - difference / this.denominator)
    }
  }

  self.onmessage = ({
    data: {
      canvas,
      organisms,
      numColorChannels,
      maxColorValue,
      target
    }
  }: Input) => {
    // If the canvas is provided, then we're initializing the FitnessEvaluator
    if (canvas !== undefined) {
      fitnessEvaluator = new FitnessEvaluator(canvas, numColorChannels, maxColorValue, target)
      return
    }

    const fe = fitnessEvaluator
    if (fe == null) {
      throw new Error('FitnessEvaluator not initialized')
    }
    const updatedOrganisms = organisms.map((org) => {
      const data = fe.getImageData(org.genome.chromosomes)
      return {
        ...org,
        genome: {
          ...org.genome
        },
        phenotype: data,
        fitness: fe.evaluateFitness(data)
      }
    })
    postMessage({ updatedOrganisms })
  }
}
