import React from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';

function ExperimentLine({
  data,
  xAccessor,
  yAccessor,
  color,
  type,
  width,
}) {
  return (
    <LinePath
      data={data}
      x={xAccessor}
      y={yAccessor}
      curve={curveMonotoneX}
      shapeRendering="geometricPrecision"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={type === 'dashed' ? '1,3' : null}
    />
  );
}

ExperimentLine.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  xAccessor: PropTypes.func.isRequired,
  yAccessor: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.string,
  width: PropTypes.number,
};

ExperimentLine.defaultProps = {
  data: [],
  type: 'solid',
  width: 1,
};

export default ExperimentLine;
