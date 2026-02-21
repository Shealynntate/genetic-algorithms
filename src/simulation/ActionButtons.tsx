import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Fab, Stack, type SxProps } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import StopIcon from '@mui/icons-material/Stop'
import { type RootState } from '../store'
import { type Simulation } from '../database/types'
import {
  endSimulationEarly,
  pauseSimulations,
  resumeSimulations,
  runSimulation
} from '../navigation/navigationSlice'

interface ActionButtonsProps {
  isActive?: boolean
  simulation: Simulation
  sx?: SxProps
}

function ActionButtons({
  isActive = false,
  simulation,
  sx
}: ActionButtonsProps): JSX.Element | null {
  const appState = useSelector(
    (state: RootState) => state.navigation.simulationState
  )
  const dispatch = useDispatch()
  const isRunning = appState === 'running'
  const isPaused = appState === 'paused'
  const showStopButton = isPaused && isActive
  // Only show the pause icon if the simulation is running and active
  const PlayIcon = isRunning && isActive ? PauseOutlinedIcon : PlayArrowIcon
  const disabled = (isRunning || isPaused) && simulation.status === 'pending'

  const onClick = (): void => {
    if (isRunning) {
      dispatch(pauseSimulations())
    } else if (isPaused) {
      dispatch(resumeSimulations())
    } else {
      dispatch(runSimulation(simulation))
    }
  }

  const onStop = (): void => {
    dispatch(endSimulationEarly())
  }

  // If the simulation is complete, don't show the buttons
  if (simulation.status === 'complete') return null

  return (
    <Stack direction="row" spacing={1} sx={sx}>
      {showStopButton && (
        <Fab
          size="extrasmall"
          color="error"
          onClick={onStop}
          sx={{ boxShadow: 'none' }}
        >
          <StopIcon />
        </Fab>
      )}
      <Fab
        onClick={onClick}
        color="primary"
        size="extrasmall"
        sx={{ boxShadow: 'none' }}
        disabled={disabled}
      >
        <PlayIcon />
      </Fab>
    </Stack>
  )
}

export default ActionButtons
