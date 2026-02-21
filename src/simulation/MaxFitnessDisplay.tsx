import React from 'react'
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material'

interface MaxFitnessDisplayProps {
  maxFitness: number
}

function MaxFitnessDisplay({
  maxFitness
}: MaxFitnessDisplayProps): JSX.Element {
  const fitnessPercent = 100 * maxFitness

  return (
    <Tooltip title={`Max Fitness: ${fitnessPercent.toFixed(4)}`}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <CircularProgress
          variant="determinate"
          value={fitnessPercent}
          color="primary"
        />
        <Box sx={{ position: 'absolute', top: 'calc(50% - 15px)', left: 5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {`${fitnessPercent.toFixed(1)}%`}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  )
}

export default MaxFitnessDisplay
