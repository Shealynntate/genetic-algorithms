import React from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';

const lineWidth = 1;

function ExperimentLine({
  data,
  xScale,
  yScale,
  color,
}) {
  return (
    <LinePath
      data={data}
      x={(entry) => xScale(entry.x)}
      y={(entry) => yScale(entry.y)}
      curve={curveMonotoneX}
      shapeRendering="geometricPrecision"
      stroke={color}
      strokeWidth={lineWidth}
    />
  );
}

ExperimentLine.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

ExperimentLine.defaultProps = {
  data: [],
};

export default ExperimentLine;
