import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import OrganismCanvas from './OrganismCanvas';

function GlobalBest() {
  const globalBest = useSelector((state) => state.metadata.globalBest);

  if (!globalBest) return null;

  return (
    <Box>
      <Typography pb={1}>All Time Best</Typography>
      <OrganismCanvas organism={globalBest.organism} />
      <Box sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption">
          {`Gen: ${globalBest.id}`}
        </Typography>
        <Typography variant="caption">
          {`Score: ${globalBest.organism.fitness.toFixed(3)}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(GlobalBest);
