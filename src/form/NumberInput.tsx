import React from 'react'
import {
  type Control,
  Controller,
  type FieldErrors,
  type FieldValues,
  type Validate,
  type PathValue,
  type FieldPathByValue
} from 'react-hook-form'
import { Input, type InputProps, Stack, Tooltip, Typography } from '@mui/material'
import _ from 'lodash'
import ErrorTooltip from '../common/ErrorTooltip'

interface NumberInputProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, number>
> extends InputProps {
  name: TPath
  control: Control<TFieldValues, number>
  readOnly: boolean
  text: string
  tooltip?: string
  min?: number
  max?: number
  step?: number
  validate?: Validate<PathValue<TFieldValues, TPath>, TFieldValues>
  errors: FieldErrors<TFieldValues>
}

function NumberInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, number>
> ({
  name,
  control,
  text,
  tooltip,
  min,
  max,
  step,
  errors,
  validate,
  readOnly = false,
  ...props
}: NumberInputProps<TFieldValues, TPath>): JSX.Element {
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
