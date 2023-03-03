import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function ImageCaption({ gen, fitness }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1 }}>
      <Box>
        <Typography variant="caption" pr={0.5}>Gen:</Typography>
        <Typography variant="caption" fontFamily="Oxygen Mono, monospace">
          {gen.toLocaleString()}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" pr={0.5}>Score:</Typography>
        <Typography variant="caption" fontFamily="Oxygen Mono, monospace">
          {fitness.toFixed(4)}
        </Typography>
      </Box>
    </Box>
  );
}

ImageCaption.propTypes = {
  gen: PropTypes.number.isRequired,
  fitness: PropTypes.number.isRequired,
};

export default ImageCaption;
