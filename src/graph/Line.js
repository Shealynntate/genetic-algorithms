import React from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { ResultsType } from '../constants/propTypes';
import theme from '../theme';

function Line({
  data,
  x,
  y,
  color,
  type,
  width,
}) {
  return (
    <LinePath
      data={data}
      x={x}
      y={y}
      curve={curveMonotoneX}
      shapeRendering="geometricPrecision"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={type === 'dashed' ? '1,3' : null}
    />
  );
}

Line.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(ResultsType)),
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  color: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
};

Line.defaultProps = {
  data: [],
  type: 'solid',
  width: 1,
  color: theme.palette.primary.main,
};

export default Line;
