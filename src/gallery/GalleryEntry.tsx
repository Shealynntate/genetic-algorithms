import React, { type ChangeEvent, useState } from 'react'
import {
  Box, IconButton, Paper, Stack, TextField, Typography, Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import { type GalleryEntryData } from './types'
import { deleteGalleryEntry, renameGalleryEntry } from '../database/api'
import { download, downloadJSON } from '../utils/fileUtils'
import { canvasParameters } from '../constants/constants'
import OrganismCanvas from '../canvas/OrganismCanvas'
import TargetCanvas from '../canvas/TargetCanvas'

interface GallerEntryProps {
  data: GalleryEntryData
  readOnly?: boolean
}

function GalleryEntry ({ data, readOnly = false }: GallerEntryProps): JSX.Element {
  const width = canvasParameters.width / 2
  const height = canvasParameters.height / 2
  const { json, id, name, simulationId } = data
  const { gif, globalBest, totalGen, parameters } = JSON.parse(json)

  const [entryName, setEntryName] = useState(name)
  const isDevelopment = process.env.NODE_ENV === 'development'

  const onDelete = (): void => {
    deleteGalleryEntry(id).catch(console.error)
  }

  const onDownload = (): void => {
    download(name, gif)
    if (isDevelopment) {
      downloadJSON(name, data)
    }
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setEntryName(value)

    // TODO: Snackbar for success/failure
    renameGalleryEntry(id, value).catch(console.error)
  }

  return (
    <Box sx={{ display: 'inline-block', m: 1 }}>
      <Stack direction='row' spacing={1}>
        <Stack spacing={1}>
          <Tooltip title='final result'>
            <OrganismCanvas organism={globalBest.organism} width={width} height={height} />
          </Tooltip>
          <Tooltip
            title='The target image'
          >
            <TargetCanvas width={width} height={height} target={parameters.population.target} />
          </Tooltip>
        </Stack>
        <Tooltip title='A timelapse of the evolution of the best solution'>
          <img src={gif} alt={`${name} gif`} />
        </Tooltip>
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
              value={entryName}
              onChange={onChangeName}
              variant='standard'
              sx={{ pb: 1 }}
              disabled={readOnly}
            />
            <Typography variant='body2'>{`Top score: ${globalBest.organism.fitness.toFixed(3)}`}</Typography>
            <Typography variant='body2'>{`Number of △: ${globalBest.organism.genome.chromosomes.length}`}</Typography>
            <Typography variant='body2'>{`Generations: ${totalGen.toLocaleString()}`}</Typography>
          </Stack>
          <Stack direction='row' sx={{ alignItems: 'end' }}>
            <IconButton onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
            {!readOnly && (
              <IconButton color='error' onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default GalleryEntry
