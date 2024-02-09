import React from 'react'
import { Box, Typography } from '@mui/material'
import { useFetchAllExperimentsQuery } from '../navigation/navigationSlice'
import GalleryEntry from './GalleryEntry'

function Gallery (): JSX.Element {
  const { data: entries = [] } = useFetchAllExperimentsQuery()
  return (
    <Box>
      <Typography variant='h4' color='GrayText' sx={{ textAlign: 'center' }}>
        Gallery
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        {entries.map((entry) => (
          <GalleryEntry key={entry.id} data={entry} />
        ))}
      </Box>
    </Box>
  )
}

export default Gallery
