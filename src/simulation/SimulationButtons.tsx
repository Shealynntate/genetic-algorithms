import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Fab, Tooltip } from '@mui/material'
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

function PrimaryButton ({ runsDisabled = false }: PrimaryButtonProps): JSX.Element | null {
  const simulationState = useSelector((state: RootState) => state.navigation.simulationState)
  const isPaused = useIsPaused()
  const dispatch = useDispatch()
  const isRunning = simulationState === 'running'
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
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={primaryButtonLabels[simulationState]}>
        <Fab
          onClick={onClick}
          size="extrasmall"
          color="primary"
          disabled={isDisabled}
          sx={{ boxShadow: 'none' }}
        >
          {isRunning ? <PauseOutlinedIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
        </Fab>
      </Tooltip>
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
