import React, { type SyntheticEvent } from 'react'
import { Checkbox, Stack, Typography } from '@mui/material'

interface CustomCheckboxProps {
  label?: string
  checked?: boolean
  onCheck?: (value: boolean) => void
}

function CustomCheckbox({
  label = '',
  checked = false,
  onCheck = (value: boolean) => {}
}: CustomCheckboxProps): JSX.Element {
  const onClick = (event: SyntheticEvent): void => {
    event.stopPropagation()
    onCheck(!checked)
  }

  return (
    <Stack direction="row" sx={{ alignItems: 'end' }}>
      <Checkbox
        size="small"
        sx={{ pb: 0 }}
        checked={checked}
        onClick={(event) => {
          onClick(event)
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  )
}

export default CustomCheckbox
