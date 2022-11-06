import React from 'react';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';
import { GenerationNodeType } from '../../types';

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

function OverviewTooltip({
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
      <LabelText label="Best" data={data.maxFitness} />
      <LabelText label="Mean" data={data.meanFitness} />
      <LabelText label="Worst" data={data.minFitness} />
    </TooltipWithBounds>
  );
}

OverviewTooltip.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  data: PropTypes.shape(GenerationNodeType).isRequired,
};

export default OverviewTooltip;
