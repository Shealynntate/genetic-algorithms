import React from 'react'
import { type Control, Controller, type FieldErrors, type FieldValues, type Path } from 'react-hook-form'
import { Input, type InputProps, Stack, Tooltip, Typography } from '@mui/material'
import _ from 'lodash'
import { ParameterValidation } from '../parameters/config'
import ErrorTooltip from '../common/ErrorTooltip'

interface NumberInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>
  control: Control<T>
  readOnly: boolean
  text: string
  tooltip?: string
  min?: number
  max?: number
  step?: number
  errors: FieldErrors<T>
}

function NumberInput<T extends FieldValues> ({
  name,
  control,
  text,
  tooltip,
  min,
  max,
  step,
  errors,
  readOnly = false,
  ...props
}: NumberInputProps<T>): JSX.Element {
  const validate = _.get(ParameterValidation, name, () => true)
  const error = _.get(errors, name)

  return (
    <Controller
      control={control}
      name={name}
      rules={{ validate }}
      render={({ field: { onChange, value } }) => (
        <Stack direction="row">
          <ErrorTooltip error={error?.message?.toString()} show={error != null}>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <Tooltip title={tooltip}>
                <Typography pr={1}>{text}</Typography>
              </Tooltip>
              <Input
                {...props}
                onChange={onChange}
                readOnly={readOnly}
                inputProps={{ min, max, step, type: 'number' }}
              />
            </Stack>
          </ErrorTooltip>
        </Stack>
      )}
    />
  )
}

export default NumberInput
