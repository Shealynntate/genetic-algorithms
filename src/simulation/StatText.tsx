import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

interface StatTextProps {
  text: string
  value: number
}

function StatText ({ text, value }: StatTextProps): JSX.Element {
  return (
    <Stack direction='row' spacing={0.25}>
      <Typography variant='lightCaption'>
        {text}
      </Typography>
      <Typography variant='lightCaption' fontFamily='Oxygen Mono, monospace'>
        {value.toFixed(4)}
      </Typography>
    </Stack>
  )
}

export default StatText
