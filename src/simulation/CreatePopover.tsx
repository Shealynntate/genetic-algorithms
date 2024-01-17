import { Popover, Typography } from '@mui/material'
import React from 'react'

interface CreatePopoverProps {
  anchorEl: HTMLButtonElement | null
  open?: boolean
  onClose?: () => void
}

function CreatePopover ({
  open = false,
  anchorEl,
  onClose = () => {}
}: CreatePopoverProps): JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open && anchorEl != null}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      slotProps={{
        paper: {
          sx: { width: '250px' }
        }
      }}
    >
        <Typography color='primary'>
          Create a new simulation and watch it run!
        </Typography>
    </Popover>
  )
}
export default CreatePopover
