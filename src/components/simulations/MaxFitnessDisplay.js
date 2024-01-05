import React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@mui/material';
import { StatsType } from '../../constants/propTypes';

function MaxFitnessDisplay({ stats }) {
  const fitness = stats?.best?.organism?.fitness || 0;

  const formattedFitness = (100 * fitness).toFixed(1);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <LinearProgress variant="determinate" value={formattedFitness} sx={{ minWidth: 60 }} dir="vert" />
      <Box>
        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
          {`${formattedFitness}%`}
        </Typography>
      </Box>
    </Box>
  );
}

MaxFitnessDisplay.propTypes = {
  stats: PropTypes.shape(StatsType),
};

MaxFitnessDisplay.defaultProps = {
  stats: null,
};

export default MaxFitnessDisplay;
