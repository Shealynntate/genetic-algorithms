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

function ControlPanel({ onRun, onReset }) {
  const target = useSelector((state) => state.target.value);
  const mutation = useSelector((state) => state.mutation.value);
  const populationSize = useSelector((state) => state.population.size);
  const isRunning = useSelector((state) => state.population.isRunning);
  const dispatch = useDispatch();

  const setSize = (value) => {
    dispatch(setPopulationSize(value));
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
          <Button
            variant="contained"
            onClick={onRun}
            disabled={isRunning}
          >
            Run
          </Button>
          <Button
            variant="outlined"
            onClick={onReset}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

ControlPanel.propTypes = {
  onRun: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ControlPanel;
