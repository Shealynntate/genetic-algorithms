import React from 'react'
import {
  Input,
  type InputProps,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'

interface TextDisplayProps extends InputProps {
  text: string
  tooltip?: string
  value: string
}

function TextDisplay({
  text,
  tooltip,
  value,
  ...props
}: TextDisplayProps): JSX.Element {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <Tooltip title={tooltip}>
        <Typography pr={1} sx={{ flexGrow: 1 }} fontSize="small">
          {text}
        </Typography>
      </Tooltip>
      <Input
        {...props}
        value={value}
        readOnly
        size="small"
        sx={{ fontSize: '0.75rem', width: 100 }}
      />
    </Stack>
  )
}

export default TextDisplay
