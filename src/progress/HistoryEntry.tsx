import React, { memo } from 'react'
import { Box, Skeleton } from '@mui/material'
import { canvasParameters } from '../constants/constants'
import Canvas from '../canvas/Canvas'
import ImageCaption from '../common/ImageCaption'

const { width, height } = canvasParameters

interface HistoryEntryProps {
  genId: number
  fitness: number
  imageData?: ImageData
}

function HistoryEntry ({ genId, fitness, imageData }: HistoryEntryProps): JSX.Element {
  if (imageData == null) {
    return (
      <Skeleton variant="rectangular" width={width} height={height} />
    )
  }

  return (
    <Box px={1}>
      <Canvas
        width={width}
        height={height}
        imageData={imageData}
        willReadFrequently={false}
      />
      <ImageCaption gen={genId} fitness={fitness} />
    </Box>
  )
}

const propsAreEqual = (prevProps: HistoryEntryProps, nextProps: HistoryEntryProps): boolean => (
  prevProps.genId === nextProps.genId
)

export default memo(HistoryEntry, propsAreEqual)
