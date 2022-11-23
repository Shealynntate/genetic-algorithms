import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { statusLabels } from '../constants';
import OrganismCanvas from './OrganismCanvas';

function SimulationStatusPanel({ styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const globalBest = useSelector((state) => state.metadata.globalBest);
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const status = statusLabels[simulationState];
  const { maxFitOrganism } = currentGen;

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${currentGen.id || 0}`}</Typography>
      <Typography>{`Fitness: ${maxFitOrganism?.fitness.toFixed(4) || 0}`}</Typography>
      <Typography>{`Deviation: ${currentGen.deviation?.toFixed(4) || 0}`}</Typography>
      {maxFitOrganism && <OrganismCanvas organism={maxFitOrganism} />}
      {globalBest && (
        <>
          <Typography>Global Best</Typography>
          <OrganismCanvas organism={globalBest.organism} />
          <Typography>{`Gen: ${globalBest.id}`}</Typography>
          <Typography>{`Fitness: ${globalBest.organism.fitness.toFixed(4)}`}</Typography>
        </>
      )}
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  styles: {},
};

export default memo(SimulationStatusPanel);
