import React from 'react'
import { Input, type InputProps, Stack, Tooltip, Typography } from '@mui/material'

interface NumberDisplayProps extends InputProps {
  text: string
  tooltip?: string
  value: number
}

function NumberDisplay ({
  text,
  tooltip,
  value,
  ...props
}: NumberDisplayProps): JSX.Element {
  return (
    <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Tooltip title={tooltip}>
        <Typography pr={1} sx={{ flexGrow: 1 }} fontSize='small'>{text}</Typography>
      </Tooltip>
      <Input
        {...props}
        value={value}
        readOnly
        inputProps={{ type: 'number' }}
        type='number'
        size='small'
        sx={{ fontSize: '0.75rem', width: 70 }}
      />
    </Stack>
  )
}

export default NumberDisplay
