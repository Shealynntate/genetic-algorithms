import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Canvas({
  height,
  imageData,
  width,
  willReadFrequently,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current && imageData) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently });
      ctx.canvas.style.width = `${width}px`;
      ctx.canvas.style.height = `${height}px`;

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
  height: PropTypes.number.isRequired,
  imageData: PropTypes.shape(ImageData),
  width: PropTypes.number.isRequired,
  willReadFrequently: PropTypes.bool,
};

Canvas.defaultProps = {
  imageData: null,
  willReadFrequently: false,
};

export default Canvas;
