import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function ImageCaption({ gen, fitness }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption">{`Gen: ${gen}`}</Typography>
      <Typography variant="caption">{`Score: ${fitness.toFixed(4)}`}</Typography>
    </Box>
  );
}

ImageCaption.propTypes = {
  gen: PropTypes.number.isRequired,
  fitness: PropTypes.number.isRequired,
};

export default ImageCaption;
