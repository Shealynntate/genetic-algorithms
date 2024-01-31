import React, { type ChangeEvent, useState } from 'react'
import {
  Box, IconButton, Paper, Stack, TextField, Typography, Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { deleteGifEntry, renameSimulation } from '../database/api'
import { download } from '../utils/fileUtils'
import { canvasParameters } from '../constants/constants'
import OrganismCanvas from '../canvas/OrganismCanvas'
import TargetCanvas from '../canvas/TargetCanvas'
import { type SimulationReport } from '../database/types'
import { useUploadExperimentReportMutation } from '../navigation/navigationSlice'

interface GallerEntryProps {
  simulationReport: SimulationReport
  readOnly?: boolean
}

function GalleryEntry ({ simulationReport, readOnly = false }: GallerEntryProps): JSX.Element {
  const width = canvasParameters.width / 2
  const height = canvasParameters.height / 2
  const [uploadSimulation] = useUploadExperimentReportMutation()
  const { results, simulation, gif } = simulationReport
  const { id, parameters, name } = simulation
  const bestOrganism = results[results.length - 1].stats.maxFitOrganism
  const totalGen = results[results.length - 1].stats.gen

  const [entryName, setEntryName] = useState(name)
  const isDevelopment = process.env.NODE_ENV === 'development'

  const onDelete = (): void => {
    if (id == null) {
      console.error('Cannot delete gallery entry with no id')
      return
    }
    deleteGifEntry(id).catch(console.error)
  }

  const onUpload = (): void => {
    if (!isDevelopment) {
      console.warn('[onUpload] Cannot upload in production')
      return
    }

    uploadSimulation(simulationReport).catch(console.error)
  }

  const onDownload = (): void => {
    if (gif == null) {
      // TODO: Turn into snackbar warning
      console.warn('[onDownload] Cannot download null gif')
      return
    }
    download(name, gif)
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setEntryName(value)

    // TODO: Snackbar for success/failure
    if (id == null) {
      console.error('Cannot rename gallery entry with no id')
      return
    }
    renameSimulation(id, value).catch(console.error)
  }

  return (
    <Box sx={{ display: 'inline-block', m: 1 }}>
      <Stack direction='row' spacing={1}>
        <Stack spacing={1}>
          <Tooltip title='final result'>
            <Box sx={{ m: 0, p: 0, lineHeight: 0 }}>
              <OrganismCanvas organism={bestOrganism} width={width} height={height} />
            </Box>
          </Tooltip>
          <Tooltip title='The target image'>
            <Box sx={{ m: 0, p: 0, lineHeight: 0 }}>
              <TargetCanvas width={width} height={height} target={parameters.population.target} />
            </Box>
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
                {id}
              </Typography>
            )}
            <TextField
              value={entryName}
              onChange={onChangeName}
              variant='standard'
              sx={{ pb: 1 }}
              disabled={readOnly}
            />
            <Typography variant='body2'>{`Top score: ${bestOrganism.fitness.toFixed(3)}`}</Typography>
            <Typography variant='body2'>{`Number of △: ${bestOrganism.genome.chromosomes.length}`}</Typography>
            <Typography variant='body2'>{`Generations: ${totalGen.toLocaleString()}`}</Typography>
          </Stack>
          <Stack direction='row' sx={{ alignItems: 'end' }}>
            <IconButton onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
            {!readOnly && (
              <Box>
                <IconButton onClick={onUpload}>
                  <CloudUploadIcon />
                </IconButton>
                <IconButton color='error' onClick={onDelete}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default GalleryEntry
