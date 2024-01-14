import React from 'react'
import { type FieldValues, type Control, type Path, Controller } from 'react-hook-form'
import { Box, Input, type InputProps, Stack, Typography, Tooltip } from '@mui/material'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'

interface ProbabilityInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>
  control: Control<T>
  text: string
  tooltip?: string
  min?: number
  max?: number
  step?: number
  hide?: boolean
  Icon?: React.ComponentType
  readOnly?: boolean
}

// Note: Start and End fitness are available as inputs here, currently not setting them
function ProbabilityInput<T extends FieldValues> ({
  name,
  control,
  text,
  tooltip,
  min,
  max,
  step,
  Icon,
  hide = false,
  readOnly = false,
  ...props
}: ProbabilityInputProps<T>): JSX.Element {
  console.log({ name })
  return (
    <Box sx={{ display: hide ? 'none' : 'flex', height: 'fit-content' }}>
      <Tooltip title={tooltip}>
        <>
          <Typography variant="body2">{text}</Typography>
          {Icon != null && <Icon />}
        </>
      </Tooltip>
      <Stack sx={{ textAlign: 'center', pl: 2 }}>
        <Controller
          control={control}
          name={`${name}.startValue` as Path<T>}
          render={({ field: { onChange, value } }) => (
            <Input
              onChange={onChange}
              value={value}
              readOnly={readOnly}
              inputProps={{
                min,
                max,
                step,
                type: 'number'
              }}
            />
          )}
        />
        <Controller
          control={control}
          name={`${name}.endValue` as Path<T>}
          render={({ field: { onChange, value } }) => (
            <Input
              readOnly={readOnly}
              onChange={onChange}
              value={value}
              inputProps={{
                min: 0,
                max: 1,
                step: 0.001,
                type: 'number'
              }}
              disableUnderline
              sx={{ display: 'none' }}
            />
          )}
        />
      </Stack>
      <Stack sx={{ justifyContent: 'center' }}>
        <DoubleArrowIcon fontSize="small" />
      </Stack>
      <Stack>
      <Controller
        control={control}
        name={`${name}.startFitness` as Path<T>}
        render={({ field: { onChange, value } }) => (
          <Input
            onChange={onChange}
            value={value}
            readOnly={readOnly}
            inputProps={{
              min: 0,
              max: 1,
              step: 0.0001,
              type: 'number'
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={`${name}.endFitness` as Path<T>}
        render={({ field: { onChange, value } }) => (
          <Input
            onChange={onChange}
            value={value}
            readOnly={readOnly}
            inputProps={{
              min: 0,
              max: 1,
              step: 0.001,
              type: 'number'
            }}
            disableUnderline
            sx={{ display: 'none' }}
          />
        )}
      />
      </Stack>
    </Box>
  )
}

export default ProbabilityInput
