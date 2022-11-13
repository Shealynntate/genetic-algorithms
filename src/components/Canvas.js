/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Canvas({
  width, height, imageData, willReadFrequently,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current && imageData) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently });
      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imageData: PropTypes.shape(ImageData),
  willReadFrequently: PropTypes.bool,
};

Canvas.defaultProps = {
  willReadFrequently: false,
  imageData: null,
};

export default Canvas;
