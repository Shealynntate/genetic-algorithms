import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Group } from '@visx/group';

const pathHeight = 15;
const pathWidth = 8;

function BrushHandle({ x, height, isBrushActive }) {
  const theme = useTheme();

  if (!isBrushActive) {
    return null;
  }

  return (
    // Need to manually offset the handles for them to be rendered at the right position
    <Group top={(height - pathHeight) / 2} left={x + pathWidth / 2}>
      <path
        d="M -3 0.5 h 5 a 2 2 0 0 1 2 2 v 11 a 2 2 0 0 1 -2 2 h -5 a 2 2 0 0 1 -2 -2 v -11 a 2 2 0 0 1 2 -2 Z M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        fill={theme.palette.grey['100']}
        strokeWidth="1"
        stroke={theme.palette.grey['400']}
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

BrushHandle.propTypes = {
  x: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isBrushActive: PropTypes.bool.isRequired,
};

export default BrushHandle;
