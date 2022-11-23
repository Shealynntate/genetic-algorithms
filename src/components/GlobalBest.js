import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import OrganismCanvas from './OrganismCanvas';

function GlobalBest() {
  const globalBest = useSelector((state) => state.metadata.globalBest);

  if (!globalBest) return null;

  return (
    <Box>
      <Typography>Global Best</Typography>
      <OrganismCanvas organism={globalBest.organism} />
      <Typography>{`Gen: ${globalBest.id}`}</Typography>
      <Typography>{`Fitness: ${globalBest.organism.fitness.toFixed(4)}`}</Typography>
    </Box>
  );
}

export default memo(GlobalBest);
