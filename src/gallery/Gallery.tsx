import { useEffect, useState } from 'react'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import SaveIcon from '@mui/icons-material/Save'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useDispatch, useSelector } from 'react-redux'

import GalleryEntry from './GalleryEntry'
import SkeletonGalleryEntry from './SkeletonGalleryEntry'
import { hasDataChanged, hasOrderChanged, sortGalleryEntries } from './utils'
import {
  openErrorSnackbar,
  openSuccessSnackbar,
  selectIsAuthenticated,
  useFetchAllExperimentsQuery,
  useUpdateExperimentsMutation
} from '../navigation/navigationSlice'

function Gallery(): JSX.Element {
  const { data: entries = [], isLoading } = useFetchAllExperimentsQuery()
  const [updateEntryOrder] = useUpdateExperimentsMutation()
  const isAdmin = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const sortedData = sortGalleryEntries(entries)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )
  const [galleryEntries, setGalleryEntries] = useState(sortedData)
  useEffect(() => {
    if (hasDataChanged(galleryEntries, sortedData)) {
      setGalleryEntries(sortGalleryEntries(entries))
    }
  }, [entries])

  const onDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    // If the order hasn't changed, don't do anything
    if (active.id === over?.id) return
    // Move the dragged item to the new position
    const oldIndex = galleryEntries.findIndex((entry) => entry.id === active.id)
    const newIndex = galleryEntries.findIndex((entry) => entry.id === over?.id)
    const reordered = arrayMove(galleryEntries, oldIndex, newIndex)
    const newOrder = reordered.map((entry, index) => ({
      ...entry,
      order: index
    }))
    setGalleryEntries(newOrder)
  }

  const onSaveOrder = (): void => {
    updateEntryOrder(galleryEntries)
      .then(() => {
        dispatch(openSuccessSnackbar('Gallery order saved'))
      })
      .catch((error) => {
        dispatch(
          openErrorSnackbar(
            `Error encountered while saving gallery order ${error}`
          )
        )
        console.error('[onSaveOrder] Failed to save gallery order')
      })
  }

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore experiments where genetic algorithms evolved polygons into art
        </Typography>
      </Stack>
      {isAdmin && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 1 }}>
          <IconButton
            color="primary"
            size="medium"
            disabled={!hasOrderChanged(sortedData, galleryEntries)}
            onClick={onSaveOrder}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      )}
      {isLoading ? (
        <Grid2 container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid2 key={i} xs={12} sm={6} lg={4}>
              <SkeletonGalleryEntry />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <DndContext onDragEnd={onDragEnd} sensors={sensors}>
          <SortableContext
            items={sortedData.map((entry) => entry.id ?? 0)}
            disabled={!isAdmin}
          >
            <Grid2 container spacing={3}>
              {galleryEntries.map((entry) => (
                <Grid2 key={entry.id} xs={12} sm={6} lg={4}>
                  <GalleryEntry data={entry} />
                </Grid2>
              ))}
            </Grid2>
          </SortableContext>
        </DndContext>
      )}
    </Box>
  )
}

export default Gallery
