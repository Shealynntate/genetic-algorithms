import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { AppState, primaryButtonLabels } from '../constants';
import {
  pauseSimulations,
  resetSimulations,
  resumeSimulations,
  runSimulations,
} from '../features/ux/uxSlice';

function PrimaryButton({ runsDisabled }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
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

  return (
    <Button
      variant="contained"
      onClick={onClick}
      size="large"
      disabled={isDisabled}
    >
      {primaryButtonLabels[simulationState]}
    </Button>
  );
}

PrimaryButton.propTypes = {
  runsDisabled: PropTypes.bool,
};

PrimaryButton.defaultProps = {
  runsDisabled: false,
};

export default PrimaryButton;
