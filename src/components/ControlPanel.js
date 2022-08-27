import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Stack, TextField,
} from '@mui/material';
import MutationSlider from './MutationSlider';
import PopulationSlider from './PopulationSlider';

function ControlPanel({ onRun, onReset }) {
  const [mutation, setMutation] = useState(0.01);
  const [populationSize, setPopulationSize] = useState(100);
  const [target, setTarget] = useState('hello');

  return (
    <Stack>
      <TextField
        label="Target Phrase"
        variant="outlined"
        value={target}
        onChange={(event) => { setTarget(event.target.value); }}
      />
      <MutationSlider rate={mutation} setRate={setMutation} />
      <PopulationSlider size={populationSize} setSize={setPopulationSize} />
      <Stack direction="row">
        <Button
          variant="contained"
          onClick={() => { onRun(populationSize, mutation); }}
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
  );
}

ControlPanel.propTypes = {
  onRun: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ControlPanel;
