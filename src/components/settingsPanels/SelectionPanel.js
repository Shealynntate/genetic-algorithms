import { Paper } from '@mui/material';
import React from 'react';
import SelectionTypeInput from '../SelectionTypeInput';
import EliteSlider from '../sliders/EliteSlider';
import PopulationSlider from '../sliders/PopulationSlider';

function SelectionPanel() {
  return (
    <Paper sx={{ mb: 1 }}>
      <SelectionTypeInput />
      <PopulationSlider />
      <EliteSlider />
    </Paper>
  );
}

export default SelectionPanel;
