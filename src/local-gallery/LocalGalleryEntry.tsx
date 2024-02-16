import React, { type ChangeEvent, useState } from 'react'
import {
  Box, IconButton, Paper, Stack, TextField, Typography, Tooltip, Fade
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { renameSimulation } from '../database/api'
import { download } from '../utils/fileUtils'
import { canvasParameters } from '../simulation/config'
import OrganismCanvas from '../canvas/OrganismCanvas'
import TargetCanvas from '../canvas/TargetCanvas'
import { type SimulationReport } from '../database/types'
import { openErrorSnackbar, openSuccessSnackbar, selectIsAuthenticated, useUploadExperimentReportMutation } from '../navigation/navigationSlice'
import { useDispatch, useSelector } from 'react-redux'

interface GallerEntryProps {
  data: SimulationReport
}

function LocalGalleryEntry ({ data }: GallerEntryProps): JSX.Element {
  const { results, simulation, gif } = data
  const { id, parameters, name } = simulation
  const [uploadExperiment] = useUploadExperimentReportMutation()
  const isAdmin = useSelector(selectIsAuthenticated)
  const [hover, setHover] = useState(false)
  const dispatch = useDispatch()
  const width = canvasParameters.width / 2
  const height = canvasParameters.height / 2
  const [entryName, setEntryName] = useState(name)
  const bestOrganism = results[results.length - 1].stats.maxFitOrganism
  const totalGen = results[results.length - 1].stats.gen

  const onUpload = (): void => {
    if (!isAdmin) {
      console.warn('[onUpload] Cannot upload in production')
      return
    }

    uploadExperiment(data)
      .then((result: { data: string } | { error: unknown }): void => {
        if ('data' in result) {
          dispatch(openSuccessSnackbar(`Experiment uploaded with id: ${result.data}`))
        } else if ('error' in result) {
          dispatch(openErrorSnackbar(`Failed to upload experiment ${result.error as string}`))
        }
      })
      .catch((e) => {
        dispatch(openErrorSnackbar(`Failed to upload experiment ${e}`))
      })
  }

  const onDownload = (): void => {
    if (gif == null) {
      dispatch(openErrorSnackbar('Cannot download null gif'))
      console.error('[onDownload] Cannot download null gif')

      return
    }
    download(name, gif)
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setEntryName(value)
    if (id == null) {
      dispatch(openErrorSnackbar('Cannot rename gallery entry with no id'))
      console.error('[onChangeName] Cannot rename gallery entry with no id')
      return
    }
    renameSimulation(id, value)
      .then(() => {
        dispatch(openSuccessSnackbar(`Renamed gallery entry to ${value}`))
      })
      .catch((error) => {
        dispatch(openErrorSnackbar(`Failed to rename gallery entry: ${error}`))
        console.error('[onChangeName] Failed to rename gallery entry: ', error)
      })
  }

  return (
    <Paper
      elevation={1}
      onMouseEnter={(): void => { setHover(true) }}
      onMouseLeave={(): void => { setHover(false) }}
      sx={{ display: 'inline-block', m: 1, p: 0 }}
    >
      <Stack direction='row'>
        <Stack>
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
      <Paper elevation={0} sx={{ position: 'relative', pt: 0, px: 1 }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Stack>
              <Typography
                color='GrayText'
                fontSize='small'
                sx={{ position: 'absolute', top: '0.25rem', right: '0.5rem' }}
              >
                {id}
              </Typography>
            <TextField
              value={entryName}
              onChange={onChangeName}
              variant='standard'
              sx={{ pb: 1 }}
            />
            <Typography variant='body2'>{`Top score: ${bestOrganism.fitness.toFixed(3)}`}</Typography>
            <Typography variant='body2'>{`Number of △: ${bestOrganism.genome.chromosomes.length}`}</Typography>
            <Typography variant='body2'>{`Generations: ${totalGen.toLocaleString()}`}</Typography>
          </Stack>
          <Fade in={hover}>
            <Stack direction='row' sx={{ alignItems: 'end' }}>
              <IconButton onClick={onDownload} color='primary'>
                <DownloadIcon />
              </IconButton>
              {isAdmin && (
                <IconButton onClick={onUpload}>
                  <CloudUploadIcon />
                </IconButton>
              )}
            </Stack>
          </Fade>
        </Stack>
      </Paper>
    </Paper>
  )
}

export default LocalGalleryEntry
