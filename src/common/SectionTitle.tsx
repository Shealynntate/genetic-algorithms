import type React from 'react'

import { Typography } from '@mui/material'

interface SectionTitleProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

function SectionTitle({
  children,
  variant = 'primary'
}: SectionTitleProps): JSX.Element {
  return (
    <Typography
      sx={{
        position: 'absolute',
        top: '0.25rem',
        left: '0.75rem',
        pr: 0.5,
        background: 'inherit',
        textTransform: 'uppercase'
      }}
      color={variant}
    >
      {children}
    </Typography>
  )
}

export default SectionTitle
