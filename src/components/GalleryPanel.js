import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import data from '../assets/test-data.json';

function Gallery() {
  const { name, images } = data;
  console.log(data);

  return (
    <Paper>
      <Typography>{name}</Typography>
      {images.map(({ gen, fitness }) => (
        <Box key={`gallery-entry-${gen}`}>
          <Typography variant="caption">{gen}</Typography>
          <Typography variant="caption">{fitness}</Typography>
        </Box>
      ))}
    </Paper>
  );
}

export default Gallery;
