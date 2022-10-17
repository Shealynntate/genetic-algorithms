import React from 'react';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';

function PopulationOverviewTooltip({
  top,
  left,
  value,
  label,
}) {
  const theme = useTheme();

  const tooltipStyles = {
    ...defaultStyles,
    background: theme.palette.primary.dark,
    border: '1px solid white',
    color: 'white',
    opacity: 0.6,
  };

  const content = `${label}: ${value}`;
  return (
    <TooltipWithBounds
      top={top}
      left={left}
      key={Math.random()}
      style={tooltipStyles}
    >
      {content}
    </TooltipWithBounds>
  );
}

PopulationOverviewTooltip.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default PopulationOverviewTooltip;
