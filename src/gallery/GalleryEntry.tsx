import { useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Tooltip,
  Fade
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import OrganismCanvas from '../canvas/OrganismCanvas'
import { type ExperimentRecord } from '../firebase/types'
import {
  openErrorSnackbar,
  openSuccessSnackbar,
  selectIsAuthenticated,
  useDeleteExperimentMutation
} from '../navigation/navigationSlice'
import { canvasParameters } from '../simulation/config'
import { downloadUrl } from '../utils/fileUtils'
import { toPercent } from '../utils/statsUtils'

interface GallerEntryProps {
  data: ExperimentRecord
}

function GalleryEntry({ data }: GallerEntryProps): JSX.Element {
  const [gifLoaded, setGifLoaded] = useState(false)
  const [hover, setHover] = useState(false)
  const isAdmin = useSelector(selectIsAuthenticated)
  const [deleteExperiment] = useDeleteExperimentMutation()
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id ?? 0 })
  const thumbWidth = canvasParameters.width / 3
  const thumbHeight = canvasParameters.height / 3
  const { results, gif, parameters, simulationName } = data
  const bestOrganism = data.maxFitOrganism
  const totalGen = results[results.length - 1].stats.gen

  const onDownload = (): void => {
    if (gif == null) {
      dispatch(openErrorSnackbar('Cannot download null gif'))
      console.error('[onDownload] Cannot download null gif')
      return
    }
    downloadUrl(gif, simulationName)
      .then(() => {
        dispatch(openSuccessSnackbar('Gif downloaded'))
      })
      .catch((error) => {
        dispatch(
          openErrorSnackbar(`Error encountered while downloading gif ${error}`)
        )
        console.error('[onDownload] Failed to download gif')
      })
  }

  const onDelete = (): void => {
    if (data.id == null) {
      console.error('[onDelete] Cannot delete experiment with null id')
      return
    }
    deleteExperiment(data.id)
      .then(() => {
        dispatch(openSuccessSnackbar('Experiment deleted'))
      })
      .catch((e) => {
        dispatch(
          openErrorSnackbar(`Error encountered while deleting experiment ${e}`)
        )
        console.error('[onDelete] Failed to delete experiment')
      })
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
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
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={gif}
          alt={`${simulationName} timelapse gif`}
          onLoad={(): void => { setGifLoaded(true) }}
          sx={{
            width: '100%',
            display: gifLoaded ? 'block' : 'none'
          }}
        />
        {!gifLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{ width: '100%', aspectRatio: '1' }}
          />
        )}
      </Box>

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
              <img
                src={parameters.population.target}
                alt="target"
                width={thumbWidth}
                height={thumbHeight}
              />
            </Box>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Stack spacing={0.25}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {simulationName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`Score: ${toPercent(bestOrganism.fitness)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${bestOrganism.genome.chromosomes.length} polygons \u00B7 ${totalGen.toLocaleString()} gen`}
            </Typography>
          </Stack>
          <Fade in={hover}>
            <Stack direction="row">
              <Tooltip title="Download GIF">
                <IconButton onClick={onDownload} color="primary" size="small">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isAdmin && (
                <IconButton onClick={onDelete} color="error" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Fade>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default GalleryEntry
