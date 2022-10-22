import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { statusLabels } from '../constants';
import Organism from '../models/organism';
import { maxFitOrganism } from '../models/utils';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Best Organism: ${best?.ToString()}`}</Typography>
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  genCount: PropTypes.number,
  currentGen: PropTypes.arrayOf(PropTypes.instanceOf(Organism)),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: null,
  styles: {},
};

export default SimulationStatusPanel;
