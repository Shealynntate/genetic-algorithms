import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { canvasParameters } from '../../constants';
import { createImageData } from '../../globals/utils';
import Canvas from './Canvas';

function TargetCanvas({
  height,
  target,
  width,
  willReadFrequently,
}) {
  const [imageData, setImageData] = useState();

  useEffect(() => {
    let isMounted = true;
    const updateImage = async () => {
      const result = await createImageData(target, { width, height });
      if (isMounted) {
        setImageData(result);
      }
    };
    updateImage();

    return () => {
      isMounted = false;
    };
  }, [target]);

  return (
    <Canvas
      height={height}
      imageData={imageData}
      width={width}
      willReadFrequently={willReadFrequently}
    />
  );
}

TargetCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  target: PropTypes.string.isRequired,
  willReadFrequently: PropTypes.bool,
};

TargetCanvas.defaultProps = {
  willReadFrequently: false,
  width: canvasParameters.width,
  height: canvasParameters.height,
};

export default TargetCanvas;
