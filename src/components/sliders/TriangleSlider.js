import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTriangles } from '../../features/metadata/metadataSlice';
import {
  maxTriangleCount,
  minTriangleCount,
  triangleStepSize,
} from '../../constants';
import ParameterSlider from './ParameterSlider';

function TriangleSlider() {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.metadata.triangleCount);

  const setValue = (v) => {
    dispatch(setTriangles(v));
  };

  return (
    <ParameterSlider
      value={value}
      setValue={setValue}
      formatValue={(v) => v.toLocaleString()}
      label="Triangles"
      min={minTriangleCount}
      max={maxTriangleCount}
      step={triangleStepSize}
    />
  );
}

export default TriangleSlider;
