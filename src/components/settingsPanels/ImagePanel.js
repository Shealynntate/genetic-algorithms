import React from 'react';
import {
  Box,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import GlobalBest from '../GlobalBest';
import ImageInput from '../ImageInput';
import TriangleSlider from '../sliders/TriangleSlider';

const imageSize = 200;

function ImagePanel() {
  return (
    <Paper>
      <Box sx={{ display: 'flex', textAlign: 'center' }}>
        <Box>
          <Tooltip title="Drag and drop an image file to set a new target">
            <Typography>Target Image</Typography>
          </Tooltip>
          <Box sx={{ minWidth: imageSize }}>
            <ImageInput />
          </Box>
        </Box>
        <GlobalBest />
      </Box>
      <TriangleSlider />
    </Paper>
  );
}

export default ImagePanel;
