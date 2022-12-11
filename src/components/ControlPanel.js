import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SimulationState } from '../constants';
import PrimaryButton from './PrimaryButton';
import { pauseSimulation, resetSimulation, runSimulation } from '../features/ux/uxSlice';
import ImagePanel from './settingsPanels/ImagePanel';
import SelectionPanel from './settingsPanels/SelectionPanel';
import MutationPanel from './settingsPanels/MutationPanel';

function ControlPanel() {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const dispatch = useDispatch();
  const isPaused = simulationState === SimulationState.PAUSED;

  const onReset = () => {
    dispatch(resetSimulation());
  };

  const onClick = () => {
    let action;
    switch (simulationState) {
      case SimulationState.RUNNING:
        action = pauseSimulation;
        break;
      case SimulationState.PAUSED:
        action = runSimulation;
        break;
      case SimulationState.COMPLETE:
        action = resetSimulation;
        break;
      default:
        action = runSimulation;
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
