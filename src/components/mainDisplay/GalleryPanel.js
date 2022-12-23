import React from 'react';
import { Paper, Typography } from '@mui/material';
import data from '../../assets/test-gallery-file.json';
import Canvas from '../Canvas';
import { canvasParameters } from '../../constants';

const { width, height } = canvasParameters;

function Gallery() {
  const {
    name, gif, globalBest, parameters,
  } = data;
  // console.log(data);

  return (
    <Paper>
      <Canvas width={width} height={height} imageData={parameters.target} />
      <img src={gif} alt={`${name} gif`} />
      <Paper elevation={2}>
        <Typography>{name}</Typography>
        <Typography>{`Top score ${globalBest.organism.fitness}`}</Typography>
      </Paper>
    </Paper>
  );
}

export default Gallery;
