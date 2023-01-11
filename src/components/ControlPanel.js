import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PausedStates, AppState } from '../constants';
import PrimaryButton from './PrimaryButton';
import {
  pauseSimulations,
  resetSimulations,
  resumeSimulations,
  runSimulations,
} from '../features/ux/uxSlice';
import ImagePanel from './settingsPanels/ImagePanel';
import SelectionPanel from './settingsPanels/SelectionPanel';
import MutationPanel from './settingsPanels/MutationPanel';

function ControlPanel() {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const dispatch = useDispatch();
  const isPaused = PausedStates.includes(simulationState);

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
    <Box spacing={1} mt={2}>
      <Typography variant="button">Controls</Typography>
      <Stack
        direction="row"
        sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}
      >
        <PrimaryButton
          currentState={simulationState}
          callback={onClick}
        />
        {isPaused && (
          <Button
            variant="outlined"
            onClick={onReset}
            size="large"
          >
            Reset
          </Button>
        )}
      </Stack>
      <ImagePanel />
      <SelectionPanel />
      <MutationPanel />
    </Box>
  );
}

export default ControlPanel;
