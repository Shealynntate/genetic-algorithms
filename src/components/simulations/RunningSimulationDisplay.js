import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import { ParametersType } from '../../constants/propTypes';
import { canvasParameters } from '../../constants/constants';
import GlobalBest from '../canvas/GlobalBest';
import TargetCanvas from '../canvas/TargetCanvas';

const { width, height } = canvasParameters;

function RunningSimulationDisplay({ simulation }) {
  if (!simulation) {
    return null;
  }

  const { target } = simulation.parameters.population;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={1}>
        <Stack>
          <Typography variant="caption" pt={1}>Target</Typography>
          <TargetCanvas width={width} height={height} target={target} />
        </Stack>
        <Stack>
          <Typography variant="caption" pt={1}>Current Best</Typography>
          <GlobalBest />
        </Stack>
      </Stack>
    </Box>
  );
}

RunningSimulationDisplay.propTypes = {
  simulation: PropTypes.shape(ParametersType),
};

RunningSimulationDisplay.defaultProps = {
  simulation: null,
};

export default RunningSimulationDisplay;
