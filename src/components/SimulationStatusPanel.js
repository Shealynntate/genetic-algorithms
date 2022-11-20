import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GenerationNodeType, GlobalBestType } from '../types';
import { statusLabels } from '../constants';
import { maxFitOrganism } from '../models/utils';
import OrganismCanvas from './OrganismCanvas';

function SimulationStatusPanel({
  currentGen,
  genCount,
  globalBest,
  styles,
}) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Fitness: ${best?.fitness.toFixed(4) || 0}`}</Typography>
      <Typography>{`Deviation: ${currentGen.deviation?.toFixed(4) || 0}`}</Typography>
      {best && <OrganismCanvas organism={best} />}
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
  genCount: PropTypes.number,
  currentGen: PropTypes.shape(GenerationNodeType),
  globalBest: PropTypes.shape(GlobalBestType),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: {},
  globalBest: null,
  styles: {},
};

export default SimulationStatusPanel;
