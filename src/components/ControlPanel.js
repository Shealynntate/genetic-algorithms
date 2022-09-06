import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Stack, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import MutationSlider from './MutationSlider';
import PopulationSlider from './PopulationSlider';
import { setTarget } from '../features/targetSlice';
import { setMutation } from '../features/mutationSlice';

function ControlPanel({ onRun, onReset }) {
  const target = useSelector((state) => state.target.value);
  const mutation = useSelector((state) => state.mutation.value);
  const dispatch = useDispatch();
  const [populationSize, setPopulationSize] = useState(100);

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
        <PopulationSlider size={populationSize} setSize={setPopulationSize} />
        <Stack direction="row">
          <Button
            variant="contained"
            onClick={() => { onRun(populationSize); }}
          >
            Run
          </Button>
          <Button
            variant="outlined"
            onClick={() => { onReset(); }}
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
