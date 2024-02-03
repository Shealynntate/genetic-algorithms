import React, { useState } from 'react'
import { Box, IconButton, Paper, Stack, TextField, Typography, Tooltip, Skeleton } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { download } from '../utils/fileUtils'
import { canvasParameters } from '../constants/constants'
import OrganismCanvas from '../canvas/OrganismCanvas'
import { type ExperimentRecord } from '../firebase/types'

interface GallerEntryProps {
  data: ExperimentRecord
  readOnly?: boolean
}

function GalleryEntry ({ data, readOnly = false }: GallerEntryProps): JSX.Element {
  const [targetLoaded, setTargetLoaded] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gifLoaded, setGifLoaded] = useState(false)
  const width = canvasParameters.width / 2
  const height = canvasParameters.height / 2
  const { results, gif, simulationId, parameters, simulationName } = data
  const bestOrganism = data.maxFitOrganism
  const totalGen = results[results.length - 1].stats.gen

  const onDownload = (): void => {
    if (gif == null) {
      // TODO: Turn into snackbar warning
      console.warn('[onDownload] Cannot download null gif')
      return
    }
    download(simulationName, gif)
  }

  return (
    <Box sx={{ display: 'inline-block', m: 1 }}>
      <Stack direction='row' spacing={0}>
        <Stack spacing={0}>
          <Tooltip title='final result'>
            <Box sx={{ m: 0, p: 0, lineHeight: 0 }}>
              <OrganismCanvas organism={bestOrganism} width={width} height={height} />
            </Box>
          </Tooltip>
          <Tooltip title='The target image'>
            <Box sx={{ m: 0, p: 0, lineHeight: 0, position: 'relative' }}>
              <img
                src={parameters.population.target}
                alt='target image'
                width={width}
                height={height}
                onLoad={(): void => { setTargetLoaded(true) }}
              />
              {!targetLoaded && (
                <Skeleton
                  variant='rectangular'
                  width={width}
                  height={height}
                  sx={{ position: 'absolute', bottom: 0, left: 0 }}
                />
              )}
            </Box>
          </Tooltip>
        </Stack>
        <Stack sx={{ position: 'relative', minWidth: width * 2 }}>
          <Tooltip title='A timelapse of the evolution of the best solution'>
            <img
              src={gif}
              alt={`${simulationName} timelapse gif`}
              onLoad={(): void => { setGifLoaded(true) }}
            />
          </Tooltip>
          <Skeleton
            variant='rectangular'
            width={width * 2}
            height={height * 2}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              visibility: gifLoaded ? 'hidden' : 'visible'
            }}
          />
        </Stack>
      </Stack>
      <Paper elevation={0} sx={{ position: 'relative', pt: 0, px: 0 }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Stack>
            {!readOnly && (
              <Typography
                color='GrayText'
                fontSize='small'
                sx={{ position: 'absolute', top: '0.25rem', right: '0.5rem' }}
              >
                {simulationId}
              </Typography>
            )}
            <TextField
              value={simulationName}
              variant='standard'
              sx={{ pb: 1 }}
              disabled={true}
            />
            <Typography variant='body2'>{`Top score: ${bestOrganism.fitness.toFixed(3)}`}</Typography>
            <Typography variant='body2'>{`Number of △: ${bestOrganism.genome.chromosomes.length}`}</Typography>
            <Typography variant='body2'>{`Generations: ${totalGen.toLocaleString()}`}</Typography>
          </Stack>
          <Stack direction='row' sx={{ alignItems: 'end' }}>
            <IconButton onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default GalleryEntry
