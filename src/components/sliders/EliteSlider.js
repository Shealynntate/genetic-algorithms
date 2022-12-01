import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eliteCountBounds } from '../../constants';
import { setEliteCount } from '../../features/parameters/parametersSlice';
import ParameterSlider from './ParameterSlider';

function EliteSlider() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.parameters.eliteCount);
  const max = useSelector((state) => state.parameters.populationSize);
  const { min, step } = eliteCountBounds;

  const setValue = (v) => {
    dispatch(setEliteCount(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      label="Elites"
      min={min}
      max={max}
      step={step}
    />
  );
}

export default EliteSlider;
