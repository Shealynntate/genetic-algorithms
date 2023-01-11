import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { AppState, primaryButtonLabels } from '../constants';
import {
  pauseSimulations,
  resetSimulations,
  resumeSimulations,
  runSimulations,
} from '../features/ux/uxSlice';
import { useIsPaused } from '../hooks';

function PrimaryButton({ runsDisabled }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const isPaused = useIsPaused();
  const dispatch = useDispatch();
  const isDisabled = runsDisabled && simulationState === AppState.NONE;

  const onClick = () => {
    let action;
    switch (simulationState) {
      case AppState.RUNNING:
        action = pauseSimulations;
        break;
      case AppState.PAUSED:
        action = resumeSimulations;
        break;
      case AppState.COMPLETE:
        action = resetSimulations;
        break;
      default:
        action = runSimulations;
    }
    dispatch(action());
  };

  const onReset = () => {
    let action;
    switch (simulationState) {
      case AppState.PAUSED:
        action = resetSimulations;
        break;
      default:
        throw new Error(`Unrecognized state ${simulationState} when onReset called`);
    }
    dispatch(action());
  };

  return (
    <Box>
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
          onClick={onReset}
          size="large"
        >
          Reset
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
