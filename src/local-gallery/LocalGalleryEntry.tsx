import { type ChangeEvent, useState } from 'react'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Fade
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import OrganismCanvas from '../canvas/OrganismCanvas'
import TargetCanvas from '../canvas/TargetCanvas'
import { renameSimulation } from '../database/api'
import { type SimulationReport } from '../database/types'
import {
  openErrorSnackbar,
  openSuccessSnackbar,
  selectIsAuthenticated,
  useUploadExperimentReportMutation
} from '../navigation/navigationSlice'
import { canvasParameters } from '../simulation/config'
import { download } from '../utils/fileUtils'

interface GallerEntryProps {
  data: SimulationReport
}

function LocalGalleryEntry({ data }: GallerEntryProps): JSX.Element {
  const { results, simulation, gif } = data
  const { id, parameters, name } = simulation
  const [uploadExperiment] = useUploadExperimentReportMutation()
  const isAdmin = useSelector(selectIsAuthenticated)
  const [hover, setHover] = useState(false)
  const dispatch = useDispatch()
  const thumbWidth = canvasParameters.width / 3
  const thumbHeight = canvasParameters.height / 3
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
          dispatch(
            openSuccessSnackbar(`Experiment uploaded with id: ${result.data}`)
          )
        } else if ('error' in result) {
          dispatch(
            openErrorSnackbar(
              `Failed to upload experiment ${result.error as string}`
            )
          )
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
    <Card
      onMouseEnter={(): void => { setHover(true) }}
      onMouseLeave={(): void => { setHover(false) }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
        }
      }}
    >
      {gif != null && (
        <Tooltip title="A timelapse of the evolution of the best solution">
          <Box sx={{ lineHeight: 0 }}>
            <img
              src={gif}
              alt={`${name} gif`}
              style={{ width: '100%', display: 'block' }}
            />
          </Box>
        </Tooltip>
      )}
      <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
          <Tooltip title="Final result">
            <Box sx={{ lineHeight: 0, borderRadius: 1, overflow: 'hidden' }}>
              <OrganismCanvas
                organism={bestOrganism}
                width={thumbWidth}
                height={thumbHeight}
              />
            </Box>
          </Tooltip>
          <Tooltip title="Target image">
            <Box sx={{ lineHeight: 0, borderRadius: 1, overflow: 'hidden' }}>
              <TargetCanvas
                width={thumbWidth}
                height={thumbHeight}
                target={parameters.population.target}
              />
            </Box>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Stack spacing={0.25}>
            <Typography
              color="text.secondary"
              sx={{ fontSize: '0.65rem' }}
            >
              {id}
            </Typography>
            <TextField
              value={entryName}
              onChange={onChangeName}
              variant="standard"
              size="small"
              sx={{ mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {`Score: ${bestOrganism.fitness.toFixed(3)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${bestOrganism.genome.chromosomes.length} polygons \u00B7 ${totalGen.toLocaleString()} gen`}
            </Typography>
          </Stack>
          <Fade in={hover}>
            <Stack direction="row" sx={{ alignItems: 'end' }}>
              <Tooltip title="Download GIF">
                <IconButton onClick={onDownload} color="primary" size="small">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isAdmin && (
                <Tooltip title="Upload to gallery">
                  <IconButton onClick={onUpload} size="small">
                    <CloudUploadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Fade>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LocalGalleryEntry
