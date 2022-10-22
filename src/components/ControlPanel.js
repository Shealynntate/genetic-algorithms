import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Stack, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SimulationState } from '../constants';
import { setMutationRate, setPopulationSize, setTarget } from '../features/metadataSlice';
import MutationSlider from './sliders/MutationSlider';
import PopulationSlider from './sliders/PopulationSlider';
import PrimaryButton from './PrimaryButton';

function ControlPanel({ onRun, onReset, onPause }) {
  const target = useSelector((state) => state.metadata.target);
  const mutation = useSelector((state) => state.metadata.mutationRate);
  const populationSize = useSelector((state) => state.metadata.populationSize);
  const simulationState = useSelector((state) => state.ux.simulationState);
  const dispatch = useDispatch();
  const isPaused = simulationState === SimulationState.PAUSED;

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

  return (
    <Paper>
      <Stack>
        <TextField
          label="Target Phrase"
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
