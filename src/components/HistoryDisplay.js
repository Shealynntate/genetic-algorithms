import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import HistoryEntry from './HistoryEntry';
import OrganismCanvas from './Canvases/OrganismCanvas';
import ImageCaption from './ImageCaption';
import { useImageDbQuery } from '../globals/database';

function HistoryDisplay() {
  const { organism, genId } = useSelector((state) => state.simulation.currentBest);
  const images = useImageDbQuery() || [];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {organism && (
      <Box px={1}>
        <OrganismCanvas organism={organism} />
        <ImageCaption gen={genId} fitness={organism.fitness} />
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
