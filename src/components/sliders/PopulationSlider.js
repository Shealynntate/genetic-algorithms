import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populationBounds } from '../../constants';
import { setPopulationSize } from '../../features/metadata/metadataSlice';
import ParameterSlider from './ParameterSlider';

function PopulationSlider() {
  const dispatch = useDispatch();
  const { max, min, step } = populationBounds;

  const value = useSelector((state) => state.metadata.populationSize);

  const setValue = (v) => {
    dispatch(setPopulationSize(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      label="Population"
      min={min}
      max={max}
      step={step}
    />
  );
}

export default PopulationSlider;
