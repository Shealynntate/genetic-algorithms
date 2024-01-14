import React from 'react'
import { useTheme } from '@mui/material'

interface ExampleTextProps {
  children: React.ReactNode
}

function ExampleText ({ children }: ExampleTextProps): JSX.Element {
  const theme = useTheme()

  return (
    <span
      style={{
        display: 'inline',
        paddingLeft: '0.4rem',
        color: theme.palette.primary.light
      }}
    >
      {children}
    </span>
  )
}

export default ExampleText
