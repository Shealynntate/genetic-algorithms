import React from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SimulationState } from '../constants';
import MutationSlider from './sliders/MutationSlider';
import PopulationSlider from './sliders/PopulationSlider';
import PrimaryButton from './PrimaryButton';
import TriangleSlider from './sliders/TriangleSlider';
import ImageInput from './ImageInput';
import InfoButton from './InfoButton';
import { pauseSimulation, resetSimulation, runSimulation } from '../features/ux/uxSlice';
import SelectionTypeInput from './SelectionTypeInput';
import EliteSlider from './sliders/EliteSlider';

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
    <Paper>
      <Stack>
        <Stack direction="row" sx={{ alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ pr: 1 }}>Target Image</Typography>
          <InfoButton message="Drag and drop an image file to set a new target" />
        </Stack>
        <Box sx={{ minWidth: 200 }}>
          <ImageInput />
        </Box>
        <TriangleSlider />
        <PopulationSlider />
        <EliteSlider />
        <MutationSlider />
        <SelectionTypeInput />
        <Stack direction="row">
          <PrimaryButton
            currentState={simulationState}
            callback={onClick}
          />
          {isPaused && (
            <Button
              variant="outlined"
              onClick={onReset}
            >
              Reset
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ControlPanel;
