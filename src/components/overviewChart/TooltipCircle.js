import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';

const radius = 4;
const stroke = 1;
const circleOpacity = 0.7;
const shadowOpacity = 0.1;
const shadow = 'black';

function TooltipCircle({ cx, cy }) {
  const theme = useTheme();

  return (
    <>
      <circle
        cx={cx}
        cy={cy + 1}
        r={radius}
        fill={shadow}
        fillOpacity={shadowOpacity}
        stroke={shadow}
        strokeOpacity={shadowOpacity}
        strokeWidth={stroke}
        pointerEvents="none"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={theme.palette.secondary.main}
        fillOpacity={circleOpacity}
        stroke={theme.palette.background.paper}
        strokeWidth={stroke}
        strokeOpacity={circleOpacity}
        pointerEvents="none"
      />
    </>
  );
}

TooltipCircle.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};

export default TooltipCircle;
