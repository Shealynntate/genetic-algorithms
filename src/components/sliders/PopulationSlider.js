import React from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import { useDispatch, useSelector } from 'react-redux';
import { populationBounds } from '../../constants';
import { setPopulationSize } from '../../features/parameters/parametersSlice';
import ParameterSlider from './ParameterSlider';

function PopulationSlider() {
  const dispatch = useDispatch();
  const { max, min, step } = populationBounds;

  const value = useSelector((state) => state.parameters.populationSize);

  const setValue = (v) => {
    dispatch(setPopulationSize(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      icon={<GroupsIcon />}
      tooltip="The number of organisms in each generation"
      min={min}
      max={max}
      step={step}
    />
  );
}

export default PopulationSlider;
