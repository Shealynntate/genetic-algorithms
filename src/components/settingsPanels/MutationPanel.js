import React from 'react';
import { Paper } from '@mui/material';
import MutationSlider from '../sliders/MutationSlider';

function MutationPanel() {
  return (
    <Paper sx={{ mb: 1 }}>
      <MutationSlider />
    </Paper>
  );
}

export default MutationPanel;
