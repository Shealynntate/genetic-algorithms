import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

interface StatTextProps {
  sigFigs?: number
  text: string
  value: number
}

function StatText ({ sigFigs = 4, text, value }: StatTextProps): JSX.Element {
  return (
    <Stack direction='row' spacing={0.25}>
      <Typography variant='lightCaption'>
        {text}
      </Typography>
      <Typography variant='lightCaption' fontFamily='Oxygen Mono, monospace'>
        {value.toFixed(sigFigs)}
      </Typography>
    </Stack>
  )
}

export default StatText
