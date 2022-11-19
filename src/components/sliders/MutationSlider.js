import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ParameterSlider from './ParameterSlider';
import { maxMutationRate, minMutationRate, mutationRateStep } from '../../constants';
import { setMutationRate } from '../../features/metadataSlice';

function MutationSlider() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.metadata.mutationRate);

  const setValue = (v) => {
    dispatch(setMutationRate(v));
  };

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

export default MutationSlider;
