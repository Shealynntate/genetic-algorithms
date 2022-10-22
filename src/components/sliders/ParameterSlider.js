import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Slider, Typography } from '@mui/material';

function ParameterSlider({
  value,
  setValue,
  formatValue,
  label,
  min,
  max,
  step,
}) {
  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant="caption">{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(_, v) => { setValue(v); }}
          aria-label={label}
          valueLabelFormat={formatValue}
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
    </Grid>
  );
}

ParameterSlider.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  formatValue: PropTypes.func,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
};

ParameterSlider.defaultProps = {
  formatValue: (v) => v,
  step: 1,
};

export default ParameterSlider;
