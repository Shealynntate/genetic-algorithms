import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Slider, Tooltip } from '@mui/material';

function ParameterSlider({
  value,
  setValue,
  formatValue,
  icon,
  tooltip,
  min,
  max,
  step,
}) {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Tooltip title={tooltip}>
          {icon}
        </Tooltip>
      </Grid>
      <Grid item xs={9}>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(_, v) => { setValue(v); }}
          aria-label={tooltip}
          valueLabelFormat={formatValue}
          valueLabelDisplay="auto"
        />
      </Grid>
    </Grid>
  );
}

ParameterSlider.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  formatValue: PropTypes.func,
  icon: PropTypes.element.isRequired,
  tooltip: PropTypes.string,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
};

ParameterSlider.defaultProps = {
  formatValue: (v) => v,
  step: 1,
  tooltip: null,
};

export default ParameterSlider;
