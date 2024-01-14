import React from 'react'
import { Box, Typography } from '@mui/material'

interface ImageCaptionProps {
  gen: number
  fitness: number
}

function ImageCaption ({ gen, fitness }: ImageCaptionProps): JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1 }}>
      <Box>
        <Typography variant="caption" pr={0.5}>Gen:</Typography>
        <Typography variant="caption" fontFamily="Oxygen Mono, monospace">
          {gen.toLocaleString()}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" pr={0.5}>Score:</Typography>
        <Typography variant="caption" fontFamily="Oxygen Mono, monospace">
          {fitness.toFixed(4)}
        </Typography>
      </Box>
    </Box>
  )
}

export default ImageCaption
