import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box, Button, Typography, useTheme,
} from '@mui/material';
import {
  endSimulationEarly,
  pauseSimulations,
  resumeSimulations,
  runSimulations,
} from '../../features/ux/uxSlice';
import { useIsPaused } from '../../features/hooks';
import { AppState } from '../../constants/typeDefinitions';
import { primaryButtonLabels } from '../../constants/websiteCopy';

function PrimaryButton({ runsDisabled }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const isPaused = useIsPaused();
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
    <Box sx={{ textAlign: 'center', mb: 1 }}>
      {isPaused && (
        <Button
          variant="outlined"
          onClick={onEndEarly}
          size="large"
          sx={{ mr: 1 }}
        >
          End Early
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onClick}
        size="large"
        disabled={isDisabled}
      >
        {primaryButtonLabels[simulationState]}
      </Button>
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
