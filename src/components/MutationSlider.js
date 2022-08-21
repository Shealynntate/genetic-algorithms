import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@mui/material';

const mutationMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 1,
    label: '100%',
  },
];

const stepSize = 0.01;

function MutationSlider({ rate, setRate }) {
  const getLabel = () => `${(rate * 100).toFixed(2)}%`;

  return (
    <Slider
      value={rate}
      min={0}
      max={1}
      step={stepSize}
      marks={mutationMarks}
      onChange={(_, value) => { setRate(value); }}
      aria-label="Mutation Rate"
      getAriaValueText={getLabel}
      valueLabelDisplay="auto"
    />
  );
}

MutationSlider.propTypes = {
  rate: PropTypes.number.isRequired,
  setRate: PropTypes.func.isRequired,
};

export default MutationSlider;
