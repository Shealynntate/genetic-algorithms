import React from 'react'
import { Box } from '@mui/material'
import HistoryEntry from './HistoryEntry'
import { useImageDbQuery } from '../database/hooks'

function HistoryDisplay (): JSX.Element {
  const images = useImageDbQuery() ?? []

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {images.slice().reverse().map(({ gen, fitness, imageData }) => (
        <HistoryEntry
          key={`history-entry-${gen}`}
          genId={gen}
          fitness={fitness}
          imageData={imageData}
        />
      ))}
    </Box>
  )
}

export default HistoryDisplay
