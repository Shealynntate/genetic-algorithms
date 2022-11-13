import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GenerationNodeType } from '../types';
import { statusLabels } from '../constants';
import { maxFitOrganism } from '../models/utils';
import OrganismCanvas from './OrganismCanvas';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Fitness: ${best?.fitness || 0}`}</Typography>
      {best && <OrganismCanvas organism={best} />}
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  genCount: PropTypes.number,
  currentGen: PropTypes.shape(GenerationNodeType),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: {},
  styles: {},
};

export default SimulationStatusPanel;
