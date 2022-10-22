import React from 'react';
import PropTypes from 'prop-types';
import ParameterSlider from './ParameterSlider';
import { maxMutationRate, minMutationRate, mutationRateStep } from '../../constants';

function MutationSlider({ value, setValue }) {
  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => `${(v * 100).toFixed(0)}%`}
      label="Mutation"
      min={minMutationRate}
      max={maxMutationRate}
      step={mutationRateStep}
    />
  );
}

MutationSlider.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default MutationSlider;
