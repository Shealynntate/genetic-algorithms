import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useImageDbQuery } from '../hooks';
import HistoryEntry from './HistoryEntry';
import OrganismCanvas from './OrganismCanvas';
import ImageCaption from './ImageCaption';

function HistoryDisplay() {
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const images = useImageDbQuery() || [];
  const { maxFitOrganism, id: genId } = currentGen;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {maxFitOrganism && (
      <Box px={1}>
        <OrganismCanvas organism={maxFitOrganism} />
        <ImageCaption gen={genId} fitness={maxFitOrganism.fitness} />
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

export default HistoryDisplay;
