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
      <Typography variant="h4" color="GrayText" sx={{ textAlign: 'center' }}>
        Gallery
      </Typography>
      {isAdmin && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap'
        }}
      >
        {isLoading && (
          <>
            <SkeletonGalleryEntry />
            <SkeletonGalleryEntry />
            <SkeletonGalleryEntry />
            <SkeletonGalleryEntry />
            <SkeletonGalleryEntry />
            <SkeletonGalleryEntry />
          </>
        )}
        <DndContext onDragEnd={onDragEnd} sensors={sensors}>
          <SortableContext
            items={sortedData.map((entry) => entry.id ?? 0)}
            disabled={!isAdmin}
          >
            {galleryEntries.map((entry) => (
              <GalleryEntry key={entry.id} data={entry} />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  )
}

export default Gallery
