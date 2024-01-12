import React, { memo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import OrganismCanvas from './OrganismCanvas'
import { canvasParameters } from '../constants/constants'
import ImageCaption from '../common/ImageCaption'
import { type RootState } from '../store'

const { width, height } = canvasParameters

function GlobalBest (): JSX.Element {
  const theme = useTheme()
  const globalBest = useSelector((state: RootState) => state.simulation.globalBest)

  return (
    <div>
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
        <Box sx={{
          flex: '1 1 auto',
          minWidth: width,
          padding: theme.spacing(1),
          paddingTop: 0
        }}
        >
          <Box sx={{
            display: 'flex',
            height: `${height}px`,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.disabled
          }}
          >
            <Typography>Waiting for data</Typography>
          </Box>
        </Box>
          )}
    </div>
  )
}

export default memo(GlobalBest)
