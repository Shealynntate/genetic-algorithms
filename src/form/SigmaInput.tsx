import React from 'react'
import { Box, Input, type InputProps, Tooltip, Typography } from '@mui/material'
import { type Control, Controller, type Path, type FieldValues } from 'react-hook-form'

interface SigmaInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>
  control: Control<T>
  text: string
  tooltip?: string
  Icon?: React.ComponentType
  readOnly?: boolean
}

function SigmaInput<T extends FieldValues> ({
  name,
  control,
  text,
  Icon,
  tooltip,
  readOnly = false
}: SigmaInputProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tooltip title={tooltip}>
            <>
              <Typography variant="body2">{text}</Typography>
              {Icon != null && <Icon />}
            </>
          </Tooltip>
          <Input
            onChange={(event) => { onChange(+event.target.value) }}
            value={value}
            readOnly={readOnly}
            inputProps={{
              min: 0,
              max: 1,
              step: 0.001,
              type: 'number'
            }}
            sx={{ ml: 2 }}
          />
        </Box>
      )}
    />
  )
}

export default SigmaInput
