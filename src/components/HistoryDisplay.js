import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { useImageDbQuery } from '../hooks';
import HistoryEntry from './HistoryEntry';
import OrganismCanvas from './OrganismCanvas';

function HistoryDisplay() {
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const images = useImageDbQuery() || [];
  const { maxFitOrganism, id: genId } = currentGen;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {maxFitOrganism && (
      <Box px={1}>
        <OrganismCanvas organism={maxFitOrganism} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">{`Gen: ${genId}`}</Typography>
          <Typography variant="caption">{`Score: ${maxFitOrganism.fitness.toFixed(3)}`}</Typography>
        </Box>
      </Box>
      )}
      {images.slice().reverse().map(({ gen, fitness, imageData }) => (
        <HistoryEntry
          key={`history-entry-${gen}`}
          genId={gen}
          fitness={fitness}
          imageData={imageData}
        />
      ))}
    </Box>
  );
}

export default memo(HistoryDisplay);
