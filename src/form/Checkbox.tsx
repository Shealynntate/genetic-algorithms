import type React from 'react'

import {
  Checkbox,
  type CheckboxProps,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import {
  type Control,
  type Path,
  type FieldValues,
  Controller
} from 'react-hook-form'

interface CustomCheckboxProps<T extends FieldValues> extends CheckboxProps {
  control: Control<T>
  name: Path<T>
  text: string
  Icon?: React.ComponentType
  tooltip?: string
  readOnly: boolean
}

function CustomCheckbox<T extends FieldValues>({
  name,
  control,
  text,
  Icon,
  tooltip,
  ...props
}: CustomCheckboxProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Stack direction="row" sx={{ alignItems: 'end', pb: 1 }}>
          <Checkbox
            {...props}
            size="small"
            sx={{ pb: 0, pr: 0.5 }}
            onChange={onChange}
            value={(value as boolean) ?? false}
            checked={(value as boolean) ?? false}
          />
          <Tooltip title={tooltip}>
            <>
              {Icon != null && <Icon />}
              <Typography variant="body2">{text}</Typography>
            </>
          </Tooltip>
        </Stack>
      )}
    />
  )
}

export default CustomCheckbox
