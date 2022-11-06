import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { OrganismNodeType } from '../types';
import { statusLabels } from '../constants';
import { maxFitOrganism } from '../models/utils';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Best Organism: ${best?.genome}`}</Typography>
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  genCount: PropTypes.number,
  currentGen: PropTypes.shape(OrganismNodeType),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: {},
  styles: {},
};

export default SimulationStatusPanel;
