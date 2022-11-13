import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Stack, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { canvasParameters, SimulationState } from '../constants';
import { setMutationRate, setPopulationSize, setTarget } from '../features/metadataSlice';
import MutationSlider from './sliders/MutationSlider';
import PopulationSlider from './sliders/PopulationSlider';
import PrimaryButton from './PrimaryButton';
import Canvas from './Canvas';
import square from '../assets/red_square_test.png';
import { createImageData } from '../models/utils';

function ControlPanel({ onRun, onReset, onPause }) {
  const target = useSelector((state) => state.metadata.target);
  const mutation = useSelector((state) => state.metadata.mutationRate);
  const populationSize = useSelector((state) => state.metadata.populationSize);
  const simulationState = useSelector((state) => state.ux.simulationState);
  const dispatch = useDispatch();
  const isPaused = simulationState === SimulationState.PAUSED;
  const [imageData, setImageData] = useState();

  useEffect(() => {
    if (!imageData) {
      const generateImage = async () => {
        setImageData(await createImageData(square));
      };
      generateImage();
    }
    // TODO: Clean-up async call in return?
  }, [imageData]);

  const setSize = (value) => {
    dispatch(setPopulationSize(value));
  };

  const setRate = (value) => {
    dispatch(setMutationRate(value));
  };

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

  const { width, height } = canvasParameters;

  return (
    <Paper>
      <Stack>
        <Typography>Target Image</Typography>
        <Canvas width={width} height={height} imageData={imageData} />
        <TextField
          label="Target Image"
          variant="outlined"
          value={target}
          onChange={(event) => { dispatch(setTarget(event.target.value)); }}
        />
        <MutationSlider value={mutation} setValue={setRate} />
        <PopulationSlider value={populationSize} setValue={setSize} />
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
