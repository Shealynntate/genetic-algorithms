import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { AppState, primaryButtonLabels } from '../../constants';
import {
  endSimulationEarly,
  pauseSimulations,
  resumeSimulations,
  runSimulations,
} from '../../features/ux/uxSlice';
import { useIsPaused } from '../../hooks';
import { deleteCurrentSimulation } from '../../globals/database';

function PrimaryButton({ runsDisabled }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const isPaused = useIsPaused();
  const dispatch = useDispatch();
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

  const onDelete = () => {
    dispatch(deleteCurrentSimulation());
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {isPaused && (
        <Button
          variant="outlined"
          onClick={onEndEarly}
          size="large"
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
      {isPaused && (
        <Button
          variant="outlined"
          onClick={onDelete}
          size="large"
          color="error"
        >
          Delete
        </Button>
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
