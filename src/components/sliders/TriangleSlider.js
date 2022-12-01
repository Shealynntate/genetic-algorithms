import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { triangleBounds } from '../../constants';
import { setTriangles } from '../../features/parameters/parametersSlice';
import ParameterSlider from './ParameterSlider';

function TriangleSlider() {
  const dispatch = useDispatch();
  const { min, max, step } = triangleBounds;

  const value = useSelector((state) => state.parameters.triangleCount);

  const setValue = (v) => {
    dispatch(setTriangles(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      label="Triangles"
      min={min}
      max={max}
      step={step}
    />
  );
}

export default TriangleSlider;
