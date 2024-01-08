import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box, Fab, Tooltip, Typography, useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import {
  endSimulationEarly,
  pauseSimulations,
  resumeSimulations,
  runSimulations,
} from '../ux/uxSlice';
import { useIsPaused } from '../ux/hooks';
import { AppState } from '../constants/typeDefinitions';
import { primaryButtonLabels } from '../constants/websiteCopy';

function PrimaryButton({ runsDisabled }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const isPaused = useIsPaused();
  const isRunning = simulationState === AppState.RUNNING;
  const dispatch = useDispatch();
  const theme = useTheme();
  let isDisabled = runsDisabled;
  let action;
  switch (simulationState) {
    case AppState.RUNNING:
      action = pauseSimulations;
      // Pause button cannot be disabled
      isDisabled = false;
      break;
    case AppState.PAUSED:
      action = resumeSimulations;
      // Resume button cannot be disabled
      isDisabled = false;
      break;
    case AppState.COMPLETE:
      action = runSimulations;
      break;
    default:
      action = runSimulations;
  }

  const onClick = () => {
    dispatch(action());
  };

  const onEndEarly = () => {
    dispatch(endSimulationEarly());
  };

  if (isDisabled) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: theme.palette.text.disabled }}>
          Create a new simulation and watch it run!
        </Typography>
      </Box>
    );
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
  );
}

PrimaryButton.propTypes = {
  runsDisabled: PropTypes.bool,
};

PrimaryButton.defaultProps = {
  runsDisabled: false,
};

export default PrimaryButton;
