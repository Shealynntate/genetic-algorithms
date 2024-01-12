import React, { useEffect, useState } from 'react'
import { createImageData } from '../utils/imageUtils'
import Canvas from './Canvas'
import { Skeleton } from '@mui/material'

interface TargetCanvasProps {
  width: number
  height: number
  target: string
  willReadFrequently: boolean
}

function TargetCanvas ({
  height,
  target,
  width,
  willReadFrequently
}: TargetCanvasProps): JSX.Element {
  const [imageData, setImageData] = useState<ImageData | null>(null)

  useEffect(() => {
    let isMounted = true
    const updateImage = async (): Promise<void> => {
      const result = await createImageData(target, { width, height })
      if (isMounted) {
        setImageData(result)
      }
    }
    updateImage().catch(console.error)

    return () => {
      isMounted = false
    }
  }, [target])

  if (imageData === null) {
    return <Skeleton variant='rectangular' width={width} height={height} />
  }
  return (
    <Canvas
      height={height}
      imageData={imageData}
      width={width}
      willReadFrequently={willReadFrequently}
    />
  )
}

export default TargetCanvas
