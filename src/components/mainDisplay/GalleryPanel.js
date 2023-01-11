import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import data from '../../assets/test-gallery-file.json';
import Canvas from '../Canvas';
import { canvasParameters } from '../../constants';
import { createImageData } from '../../globals/utils';

const { width, height } = canvasParameters;

function Gallery() {
  const [imageData, setImageData] = useState();

  const {
    name, gif, globalBest, parameters,
  } = data;

  useEffect(() => {
    let isMounted = true;
    const updateImage = async () => {
      const result = await createImageData(parameters.population.target);
      if (isMounted) {
        setImageData(result);
      }
    };
    updateImage();

    return () => {
      isMounted = false;
    };
  }, [parameters.target]);

  // console.log(data);

  return (
    <Paper>
      <Canvas width={width} height={height} imageData={imageData} />
      <img src={gif} alt={`${name} gif`} />
      <Paper elevation={2}>
        <Typography>{name}</Typography>
        <Typography>{`Top score ${globalBest.organism.fitness}`}</Typography>
      </Paper>
    </Paper>
  );
}

export default Gallery;
