import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import HistoryEntry from './HistoryEntry';
import { ImageEntryType } from '../types';

function HistoryDisplay({ images }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {images.slice().reverse().map(({ gen, fitness, imageData }) => (
        <HistoryEntry
          key={`history-entry-${gen}`}
          genId={gen}
          fitness={fitness}
          imageData={imageData}
        />
      ))}
    </Box>
  );
}

HistoryDisplay.propTypes = {
  images: PropTypes.arrayOf(ImageEntryType),
};

HistoryDisplay.defaultProps = {
  images: [],
};

export default memo(HistoryDisplay);
