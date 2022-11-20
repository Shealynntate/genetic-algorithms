import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button, Paper, Stack, Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { SimulationState } from '../constants';
import MutationSlider from './sliders/MutationSlider';
import PopulationSlider from './sliders/PopulationSlider';
import PrimaryButton from './PrimaryButton';
import { createImageData } from '../models/utils';
import TriangleSlider from './sliders/TriangleSlider';
import ImageInput from './ImageInput';
import InfoButton from './InfoButton';

function ControlPanel({ onRun, onReset, onPause }) {
  const target = useSelector((state) => state.metadata.target);
  const simulationState = useSelector((state) => state.ux.simulationState);
  const [imageData, setImageData] = useState();
  const isPaused = simulationState === SimulationState.PAUSED;

  useEffect(() => {
    if (!imageData) {
      const generateImage = async () => {
        setImageData(await createImageData(target));
      };
      generateImage();
    }
    // TODO: Clean-up async call in return?
  }, [imageData]);

  const getCallback = () => {
    switch (simulationState) {
      case SimulationState.RUNNING:
        return onPause;
      case SimulationState.PAUSED:
        return onRun;
      case SimulationState.COMPLETE:
        return onReset;
      default:
        return onRun;
    }
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
        <MutationSlider />
        <PopulationSlider />
        <TriangleSlider />
        <Stack direction="row">
          <PrimaryButton
            currentState={simulationState}
            callback={getCallback()}
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

ControlPanel.propTypes = {
  onRun: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
};

export default ControlPanel;
