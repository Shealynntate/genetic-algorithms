import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, CircularProgress, Tooltip, Typography,
} from '@mui/material';
import { StatsType } from '../constants/propTypes';

function MaxFitnessDisplay({ stats }) {
  const fitness = stats?.best?.organism?.fitness || 0;
  const fitnessPercent = (100 * fitness);

  return (
    <Tooltip title={`Max Fitness: ${fitnessPercent.toFixed(4)}`}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CircularProgress variant="determinate" value={fitnessPercent} />
        <Box sx={{ position: 'absolute', top: 10, left: 5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {`${fitnessPercent.toFixed(1)}%`}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

MaxFitnessDisplay.propTypes = {
  stats: PropTypes.shape(StatsType),
};

MaxFitnessDisplay.defaultProps = {
  stats: null,
};

export default MaxFitnessDisplay;
