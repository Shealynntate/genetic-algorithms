import { useEffect, useRef } from 'react'

interface CanvasProps {
  height: number
  imageData: ImageData
  width: number
  willReadFrequently: boolean
}

function Canvas({
  height,
  imageData,
  width,
  willReadFrequently
}: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current != null) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently })
      if (ctx == null) {
        console.error('[Canvas] Could not get canvas context')
        return
      }
      ctx.canvas.style.width = `${width}px`
      ctx.canvas.style.height = `${height}px`
      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(imageData, 0, 0)
    }
  }, [imageData])

  return <canvas width={width} height={height} ref={canvasRef} />
}

export default Canvas
