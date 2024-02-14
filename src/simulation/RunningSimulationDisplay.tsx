import React from 'react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { type Simulation } from '../database/types'
import { canvasParameters } from '../simulation/config'
import TargetCanvas from '../canvas/TargetCanvas'
import { type RootState } from '../store'
import { useSelector } from 'react-redux'
import OrganismCanvas from '../canvas/OrganismCanvas'

const { width, height } = canvasParameters

interface RunningSimulationDisplayProps {
  simulation?: Simulation
}

function RunningSimulationDisplay ({ simulation }: RunningSimulationDisplayProps): JSX.Element {
  const globalBest = useSelector((state: RootState) => state.simulation.globalBest)
  const polygonCount = globalBest?.organism.genome.chromosomes.length

  const target = simulation?.parameters.population.target
  return (
    <Stack>
      <Stack direction="row" spacing={1}>
        <Stack>
          <Typography variant="caption" pt={1}>Target</Typography>
          {target != null
            ? <TargetCanvas width={width} height={height} target={target} />
            : <Skeleton variant="rectangular" width={width} height={height} />
          }
        </Stack>
        <Stack>
          <Typography variant="caption" pt={1}>Current Best</Typography>
          {globalBest != null
            ? <OrganismCanvas
              organism={globalBest.organism}
              width={width}
              height={height}
              willReadFrequently={false}
            />
            : <Skeleton variant="rectangular" width={width} height={height} />
          }
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1 }}>
        <Stack direction='row' spacing={0.5}>
          <Typography variant='caption'>Gen:</Typography>
          <Typography variant='codeCaption'>
            {globalBest?.gen.toLocaleString() ?? 0}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={0.5}>
          <Typography variant='caption'>△:</Typography>
          <Typography variant='codeCaption'>
            {polygonCount}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={0.5}>
          <Typography variant='caption'>Score:</Typography>
          <Typography variant='codeCaption'>
            {globalBest?.organism.fitness.toFixed(4) ?? 0}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  )
}

export default RunningSimulationDisplay
