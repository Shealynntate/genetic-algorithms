import React from 'react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { type Simulation } from '../database/types'
import { canvasParameters } from '../constants/constants'
import TargetCanvas from '../canvas/TargetCanvas'
import { type RootState } from '../store'
import { useSelector } from 'react-redux'
import ImageCaption from '../common/ImageCaption'
import OrganismCanvas from '../canvas/OrganismCanvas'

const { width, height } = canvasParameters

interface RunningSimulationDisplayProps {
  simulation?: Simulation
}

function RunningSimulationDisplay ({ simulation }: RunningSimulationDisplayProps): JSX.Element {
  const globalBest = useSelector((state: RootState) => state.simulation.globalBest)
  const target = simulation?.parameters.population.target

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            ? (
            <>
              <OrganismCanvas
                organism={globalBest.organism}
                width={width}
                height={height}
                willReadFrequently={false}
              />
              <ImageCaption gen={globalBest.gen} fitness={globalBest.organism.fitness} />
            </>
              )
            : (
            <Skeleton variant="rectangular" width={width} height={height} />
              )}
        </Stack>
      </Stack>
    </Box>
  )
}

export default RunningSimulationDisplay
