import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { canvasParameters } from '../constants';
import { OrganismType } from '../types';
// import Chromosome from '../models/chromosomes';

function OrganismCanvas({
  organism, width, height, willReadFrequently,
}) {
  const scalePoint = (point) => [point[0] * width, point[1] * height];

  const canvasRef = useRef();
  const { chromosomes } = organism.genome;

  useEffect(() => {
    if (canvasRef.current && chromosomes) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently });
      ctx.canvas.style.width = `${width}px`;
      ctx.canvas.style.height = `${height}px`;

      ctx.clearRect(0, 0, width, height);
      chromosomes.forEach((base) => {
        const { color, points } = base;
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        ctx.beginPath();
        ctx.moveTo(...scalePoint(points[0]));
        for (let i = 1; i < points.length; ++i) {
          ctx.lineTo(...scalePoint(points[i]));
        }
        ctx.closePath();
        ctx.fill();
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
