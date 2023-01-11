import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChangeHistoryTwoToneIcon from '@mui/icons-material/ChangeHistoryTwoTone';
import { triangleBounds } from '../../constants';
import { setMinPolygons } from '../../features/parameters/parametersSlice';
import ParameterSlider from './ParameterSlider';

function TriangleSlider() {
  const dispatch = useDispatch();
  const { min, max, step } = triangleBounds;

  const value = useSelector((state) => state.parameters.population.minPolygons);

  const setValue = (v) => {
    dispatch(setMinPolygons(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      icon={<ChangeHistoryTwoToneIcon />}
      tooltip="Number of triangles used in a image"
      min={min}
      max={max}
      step={step}
    />
  );
}

export default TriangleSlider;
