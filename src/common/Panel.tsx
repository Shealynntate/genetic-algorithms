import React from 'react'
import { Box } from '@mui/material'
import SectionTitle from './SectionTitle'

interface PanelProps {
  children: React.ReactNode
  label?: string
  variant?: 'primary' | 'secondary'
  pt?: number
  px?: number
  pb?: number
}

function Panel ({
  label,
  children,
  variant = 'primary',
  pt = 1.5,
  px = 1,
  pb = 1
}: PanelProps): JSX.Element {
  return (
    <Box
      sx={{
        position: 'relative', p: '0.8rem', mb: 1
      }}
    >
      {label != null && <SectionTitle variant={variant}>{label}</SectionTitle>}
      <Box sx={{
        pt,
        px,
        pb
      }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Panel
