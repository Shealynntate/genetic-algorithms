import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Paper, Stack, Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import OrganismCanvas from './OrganismCanvas';
import Canvas from './Canvas';
import { canvasParameters } from '../constants';
import { useImageDbQuery } from '../hooks';

const { width, height } = canvasParameters;

function StatusText({ children }) {
  return <Typography variant="caption" sx={{ display: 'block' }}>{children}</Typography>;
}

StatusText.propTypes = {
  children: PropTypes.node.isRequired,
};

function HistoryEntry({ genId, fitness, imageData }) {
  return (
    <Box>
      <Canvas
        width={width}
        height={height}
        imageData={imageData}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Typography variant="caption">{`Gen: ${genId}`}</Typography>
        <Typography variant="caption">{`Score: ${fitness.toFixed(3)}`}</Typography>
      </Box>
    </Box>
  );
}

HistoryEntry.propTypes = {
  genId: PropTypes.number.isRequired,
  fitness: PropTypes.number.isRequired,
  imageData: PropTypes.instanceOf(ImageData).isRequired,
};

function SimulationStatusPanel() {
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const images = useImageDbQuery() || [];
  const { maxFitOrganism } = currentGen;

  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <Typography>Current Best</Typography>
          {maxFitOrganism && <OrganismCanvas organism={maxFitOrganism} />}
          <StatusText>{`Generation: ${currentGen.id || 0}`}</StatusText>
          <StatusText>{`Fitness: ${maxFitOrganism?.fitness.toFixed(4) || 0}`}</StatusText>
          <StatusText>{`Deviation: ${currentGen.deviation?.toFixed(4) || 0}`}</StatusText>
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.slice().reverse().map(({ gen, fitness, imageData }) => (
          <HistoryEntry
            key={`history-entry-${gen}`}
            genId={gen}
            fitness={fitness}
            imageData={imageData}
          />
        ))}
      </Box>
    </Paper>
  );
}

export default memo(SimulationStatusPanel);
