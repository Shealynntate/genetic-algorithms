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
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
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
