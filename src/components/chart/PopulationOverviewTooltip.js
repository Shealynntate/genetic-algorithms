import React from 'react';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';

function LabelText({ label, data }) {
  return (
    <Typography variant="caption" component="div">
      {`${label} ${data.toFixed(2)}`}
    </Typography>
  );
}

LabelText.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.number.isRequired,
};

function PopulationOverviewTooltip({
  top,
  left,
  data,
}) {
  const theme = useTheme();

  const tooltipStyles = {
    ...defaultStyles,
    background: theme.palette.primary.dark,
    border: '1px solid white',
    color: 'white',
    opacity: 0.6,
  };

  return (
    <TooltipWithBounds
      top={top}
      left={left}
      key={Math.random()}
      style={tooltipStyles}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{ textDecoration: 'underline' }}
      >
        {`Gen ${data.x}`}
      </Typography>
      <LabelText label="Best" data={data.top} />
      <LabelText label="Mean" data={data.mean} />
      <LabelText label="Worst" data={data.bottom} />
    </TooltipWithBounds>
  );
}

PopulationOverviewTooltip.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default PopulationOverviewTooltip;
