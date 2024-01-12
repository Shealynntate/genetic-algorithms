import React, { useEffect, useRef } from 'react'
import { type Organism } from '../population/types'
import { renderGenomeToCanvas } from '../utils/imageUtils'

interface OrganismCanvasProps {
  organism: Organism
  width: number
  height: number
  willReadFrequently: boolean
}

function OrganismCanvas ({
  organism,
  width,
  height,
  willReadFrequently
}: OrganismCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current != null && organism != null) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently })
      if (ctx == null) {
        console.error('[OrganismCanvas] Could not get canvas context')
        return
      }
      ctx.canvas.style.width = `${width}px`
      ctx.canvas.style.height = `${height}px`
      ctx.clearRect(0, 0, width, height)
      renderGenomeToCanvas(organism.genome, ctx, { w: width, h: height })
    }
  }, [organism.genome])

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  )
}

export default OrganismCanvas
