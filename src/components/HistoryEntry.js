import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { canvasParameters } from '../constants';
import Canvas from './Canvas';

const { width, height } = canvasParameters;

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

export default memo(HistoryEntry);
