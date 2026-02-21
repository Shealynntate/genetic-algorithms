import React from 'react'
import { Box, type SxProps, Tooltip } from '@mui/material'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import { type SimulationStatus } from './types'

interface IconEntry {
  icon: JSX.Element
  tooltip: string
}

const statusIconMap: Record<SimulationStatus, IconEntry> = {
  pending: {
    icon: <PendingOutlinedIcon color="inherit" />,
    tooltip: 'Pending'
  },
  running: {
    icon: <RunCircleOutlinedIcon color="info" />,
    tooltip: 'Running'
  },
  paused: {
    icon: <PauseCircleOutlineOutlinedIcon color="warning" />,
    tooltip: 'Paused'
  },
  complete: {
    icon: <CheckCircleOutlineOutlinedIcon color="success" />,
    tooltip: 'Completed'
  },
  unknown: {
    icon: <PendingOutlinedIcon color="warning" />,
    tooltip: 'Unknown'
  }
}

interface StatusIconProps {
  status: SimulationStatus
  sx?: SxProps
}

function StatusIcon({ status, sx }: StatusIconProps): JSX.Element {
  const data: IconEntry = statusIconMap[status]
  return (
    <Tooltip title={data.tooltip}>
      <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
        {data.icon}
      </Box>
    </Tooltip>
  )
}

export default StatusIcon
