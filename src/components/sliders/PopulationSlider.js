import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { maxPopulationSize, minPopulationSize, populationStepSize } from '../../constants';
import { setPopulationSize } from '../../features/metadata/metadataSlice';
import ParameterSlider from './ParameterSlider';

function PopulationSlider() {
  const dispatch = useDispatch();

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
      min={minPopulationSize}
      max={maxPopulationSize}
      step={populationStepSize}
    />
  );
}

export default PopulationSlider;
