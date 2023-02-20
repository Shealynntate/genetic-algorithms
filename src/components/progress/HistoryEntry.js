import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { canvasParameters } from '../../constants';
import Canvas from '../Canvases/Canvas';
import ImageCaption from '../common/ImageCaption';

const { width, height } = canvasParameters;

function HistoryEntry({ genId, fitness, imageData }) {
  return (
    <Box px={1}>
      <Canvas
        width={width}
        height={height}
        imageData={imageData}
      />
      <ImageCaption gen={genId} fitness={fitness} />
    </Box>
  );
}

HistoryEntry.propTypes = {
  genId: PropTypes.number.isRequired,
  fitness: PropTypes.number.isRequired,
  imageData: PropTypes.instanceOf(ImageData).isRequired,
};

const propsAreEqual = (prevProps, nextProps) => (
  prevProps.genId === nextProps.genId
);

export default memo(HistoryEntry, propsAreEqual);
