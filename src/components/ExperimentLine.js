import React from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';

const lineWidth = 1;
const dashedLineWidth = 0.5;

function ExperimentLine({
  data,
  xScale,
  yScale,
  color,
  type,
}) {
  return (
    <LinePath
      data={data}
      x={(entry) => xScale(entry.x)}
      y={(entry) => yScale(entry.y)}
      curve={curveMonotoneX}
      shapeRendering="geometricPrecision"
      stroke={color}
      strokeWidth={type === 'dashed' ? dashedLineWidth : lineWidth}
      strokeDasharray={type === 'dashed' ? '1,3' : null}
    />
  );
}

ExperimentLine.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.string,
};

ExperimentLine.defaultProps = {
  data: [],
  type: 'solid',
};

export default ExperimentLine;
