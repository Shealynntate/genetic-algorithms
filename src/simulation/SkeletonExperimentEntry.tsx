import { Checkbox, Paper, Skeleton, Stack } from '@mui/material'
import React from 'react'

function SkeletonExperimentEntry(): JSX.Element {
  return (
    <Paper elevation={1}>
      <Stack direction="row" spacing={2}>
        <Checkbox disabled />
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
        <Skeleton variant="circular" width={40} height={40} />
      </Stack>
    </Paper>
  )
}

export default SkeletonExperimentEntry
