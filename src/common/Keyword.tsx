import React from 'react'
import { useTheme } from '@mui/material'

interface KeywordProps {
  children: React.ReactNode
  pl?: string
  pr?: string
}

function Keyword ({
  pl = '0.4rem',
  pr = '0.4rem',
  children
}: KeywordProps): JSX.Element {
  const theme = useTheme()

  return (
    <span style={{
      paddingLeft: pl,
      paddingRight: pr,
      color: theme.palette.secondary.main
    }}
    >
      {children}
    </span>
  )
}

export default Keyword
