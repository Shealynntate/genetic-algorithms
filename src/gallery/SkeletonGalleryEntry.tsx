import React from 'react'
import { Paper, Skeleton, Stack } from '@mui/material'
import { canvasParameters } from '../simulation/config'

function SkeletonGalleryEntry(): JSX.Element {
  const width = canvasParameters.width
  const height = canvasParameters.height

  return (
    <Paper elevation={1} sx={{ p: 0, m: 1 }}>
      <Stack>
        <Skeleton variant="rectangular" width={width * 1.5} height={height} />
        <Paper elevation={0} sx={{ p: 1 }}>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="80%" />
        </Paper>
      </Stack>
    </Paper>
  )
}

export default SkeletonGalleryEntry
