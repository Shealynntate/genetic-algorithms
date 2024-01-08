import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { canvasParameters } from '../constants/constants';
import { OrganismType } from '../constants/propTypes';
import { chromosomesToCanvas } from '../utils/imageUtils';

function OrganismCanvas({
  organism,
  width,
  height,
  willReadFrequently,
}) {
  const canvasRef = useRef();
  const { chromosomes } = organism.genome;

  useEffect(() => {
    if (canvasRef.current && chromosomes) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently });
      ctx.canvas.style.width = `${width}px`;
      ctx.canvas.style.height = `${height}px`;

      ctx.clearRect(0, 0, width, height);
      chromosomesToCanvas({
        chromosomes,
        ctx,
        w: width,
        h: height,
      });
    }
  }, [chromosomes]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}

OrganismCanvas.propTypes = {
  organism: PropTypes.shape(OrganismType).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  willReadFrequently: PropTypes.bool,
};

OrganismCanvas.defaultProps = {
  width: canvasParameters.width,
  height: canvasParameters.height,
  willReadFrequently: false,
};

export default OrganismCanvas;
