import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Canvas({ width, height, imageData }) {
  const canvasRef = useRef();
  console.log(imageData);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
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
  imageData: PropTypes.shape(ImageData).isRequired,
};

export default Canvas;
