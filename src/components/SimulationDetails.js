import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';

function SimulationDetails({ simulation }) {
  if (!simulation) return null;

  const { id, name } = simulation;

  return (
    <Box>
      <Typography>{`${id}. ${name}`}</Typography>
      <Stack direction="row">
        <Stack>
          <Typography>Population</Typography>
          <Typography>Selection</Typography>
        </Stack>
        <Stack>
          <Typography>Crossover</Typography>
          <Typography>Mutation</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

SimulationDetails.propTypes = {
  simulation: PropTypes.objectOf(PropTypes.number),
};

SimulationDetails.defaultProps = {
  simulation: null,
};

export default SimulationDetails;
