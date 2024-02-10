import React from 'react'
import { Box, Typography } from '@mui/material'
import { useFetchAllExperimentsQuery } from '../navigation/navigationSlice'
import GalleryEntry from './GalleryEntry'
import SkeletonGalleryEntry from './SkeletonGalleryEntry'

function Gallery (): JSX.Element {
  const { data: entries = [], isLoading } = useFetchAllExperimentsQuery()
  return (
    <Box>
      <Typography variant='h4' color='GrayText' sx={{ textAlign: 'center' }}>
        Gallery
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
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
        {entries.map((entry) => (
          <GalleryEntry key={entry.id} data={entry} />
        ))}
      </Box>
    </Box>
  )
}

export default Gallery
