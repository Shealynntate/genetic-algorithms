import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@mui/material';

const maxPopulationSize = 1e5;

function PopulationSlider({ size, setSize }) {
  return (
    <Slider
      value={size}
      min={1}
      max={maxPopulationSize}
      onChange={(_, value) => { setSize(value); }}
      aria-label="Population Size"
    />
  );
}

PopulationSlider.propTypes = {
  size: PropTypes.number.isRequired,
  setSize: PropTypes.func.isRequired,
};

export default PopulationSlider;
