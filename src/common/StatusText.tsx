import type React from 'react'

import { Box, Typography } from '@mui/material'

interface StatusTextProps {
  label: string
  children: React.ReactNode
}

function StatusText({ label, children }: StatusTextProps): JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" pr={1}>{`${label}: `}</Typography>
      <Typography variant="caption" fontFamily="'Oxygen Mono', monospace">
        {children}
      </Typography>
    </Box>
  )
}

export default StatusText
