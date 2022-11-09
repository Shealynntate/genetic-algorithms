import React from 'react';
import PropTypes from 'prop-types';
import { canvasParameters } from '../constants';
import { OrganismNodeType } from '../types';
import Canvas from './Canvas';

function OrganismCanvas({ organism, width, height }) {
  console.log(organism);
  const { phenotype } = organism.genome;

  return (
    <Canvas
      width={width}
      height={height}
      imageData={phenotype}
    />
  );
}

OrganismCanvas.propTypes = {
  organism: PropTypes.shape(OrganismNodeType).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

OrganismCanvas.defaultProps = {
  width: canvasParameters.width,
  height: canvasParameters.height,
};

export default OrganismCanvas;
