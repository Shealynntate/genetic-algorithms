import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import OrganismCanvas from './OrganismCanvas';

function GlobalBest() {
  const globalBest = useSelector((state) => state.metadata.globalBest);

  if (!globalBest) return null;

  return (
    <Box>
      <Typography>All Time Best</Typography>
      <OrganismCanvas organism={globalBest.organism} />
      <Box>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {`Gen: ${globalBest.id}`}
        </Typography>
        <Typography variant="caption">
          {`Fitness: ${globalBest.organism.fitness.toFixed(4)}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(GlobalBest);
