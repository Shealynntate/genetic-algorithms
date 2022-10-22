import React from 'react';
import PropTypes from 'prop-types';
import { maxPopulationSize, minPopulationSize } from '../../constants';
import ParameterSlider from './ParameterSlider';

function PopulationSlider({ value, setValue }) {
  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      label="Population"
      min={minPopulationSize}
      max={maxPopulationSize}
    />
  );
}

PopulationSlider.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default PopulationSlider;
