import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { ParametersType } from '../constants/propTypes';
import SimulationForm from '../form/SimulationForm';

function SimulationDetails({ simulation }) {
  if (!simulation) return null;

  const { id, name, parameters } = simulation;

  return (
    <Box>
      <Typography>{`${id}. ${name}`}</Typography>
      <SimulationForm
        imageWidth={130}
        imageHeight={130}
        readOnly
        defaultValues={parameters}
      />
    </Box>
  );
}

SimulationDetails.propTypes = {
  simulation: PropTypes.shape(ParametersType),
};

SimulationDetails.defaultProps = {
  simulation: null,
};

export default SimulationDetails;
