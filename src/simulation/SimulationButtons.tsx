import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Fab, Tooltip, Typography, useTheme } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import { type ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import {
  endSimulationEarly,
  pauseSimulations,
  resumeSimulations,
  runSimulations
} from '../navigation/navigationSlice'
import { type RootState } from '../store'
import { useIsPaused } from '../navigation/hooks'
import { primaryButtonLabels } from '../constants/websiteCopy'

interface PrimaryButtonProps {
  runsDisabled?: boolean
}

function PrimaryButton ({ runsDisabled = false }: PrimaryButtonProps): JSX.Element {
  const simulationState = useSelector((state: RootState) => state.navigation.simulationState)
  const isPaused = useIsPaused()
  const isRunning = simulationState === 'running'
  const dispatch = useDispatch()
  const theme = useTheme()
  let isDisabled = runsDisabled
  let action: ActionCreatorWithoutPayload | undefined
  switch (simulationState) {
    case 'running':
      action = pauseSimulations
      // Pause button cannot be disabled
      isDisabled = false
      break
    case 'paused':
      action = resumeSimulations
      // Resume button cannot be disabled
      isDisabled = false
      break
    case 'complete':
      action = runSimulations
      break
    default:
      action = runSimulations
  }

  const onClick = (): void => {
    if (action != null) {
      dispatch(action())
    }
  }

  const onEndEarly = (): void => {
    dispatch(endSimulationEarly())
  }

  if (isDisabled) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: theme.palette.text.disabled }}>
          Create a new simulation and watch it run!
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Fab
        onClick={onClick}
        size="extrasmall"
        color="primary"
        disabled={isDisabled}
        sx={{ boxShadow: 'none' }}
      >
        <Tooltip title={primaryButtonLabels[simulationState]}>
          {isRunning ? <PauseOutlinedIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
        </Tooltip>
      </Fab>
      {isPaused && (
        <Tooltip title="End run early">
          <Fab
            size="extrasmall"
            onClick={onEndEarly}
            color="error"
            sx={{ ml: 1, boxShadow: 'none' }}
          >
            <StopIcon fontSize="small" />
          </Fab>
        </Tooltip>
      )}
    </Box>
  )
}

export default PrimaryButton
