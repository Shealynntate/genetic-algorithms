import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Stack, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import MutationSlider from './MutationSlider';
import PopulationSlider from './PopulationSlider';
import { setTarget } from '../features/targetSlice';
import { setMutation } from '../features/mutationSlice';
import { setPopulationSize } from '../features/populationSlice';
import { SimulationState } from '../constants';

const buttonLabels = {
  [SimulationState.NONE]: 'Run',
  [SimulationState.RUNNING]: 'Pause',
  [SimulationState.PAUSED]: 'Resume',
  [SimulationState.COMPLETE]: 'Reset',
};

function PrimaryButton({ currentState, callback }) {
  return (
    <Button
      variant="contained"
      onClick={callback}
    >
      {buttonLabels[currentState]}
    </Button>
  );
}

PrimaryButton.propTypes = {
  currentState: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

function ControlPanel({ onRun, onReset, onPause }) {
  const target = useSelector((state) => state.target.value);
  const mutation = useSelector((state) => state.mutation.value);
  const populationSize = useSelector((state) => state.population.size);
  const simulationState = useSelector((state) => state.population.simulationState);
  const dispatch = useDispatch();

  const setSize = (value) => {
    dispatch(setPopulationSize(value));
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
        <MutationSlider rate={mutation} setRate={(value) => { dispatch(setMutation(value)); }} />
        <PopulationSlider size={populationSize} setSize={setSize} />
        <Stack direction="row">
          <PrimaryButton
            currentState={simulationState}
            callback={getCallback()}
          />
          {simulationState === SimulationState.PAUSED && (
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
