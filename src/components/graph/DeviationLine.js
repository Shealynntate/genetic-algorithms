import React from 'react';
import PropTypes from 'prop-types';
import { Threshold } from '@visx/threshold';
import { curveMonotoneX } from '@visx/curve';
import { SimulationType } from '../../constants/propTypes';
import Line from './Line';

function DeviationLine({
  color,
  data,
  id,
  xScale,
  yScale,
  yMax,
}) {
  return (
    <>
      <Threshold
        id={`id-${id}`}
        data={data}
        x={({ stats }) => xScale(stats.genId)}
        y0={({ stats }) => (
          yScale(stats.meanFitness - stats.deviation)
        )}
        y1={({ stats }) => (
          yScale(stats.meanFitness + stats.deviation)
        )}
        curve={curveMonotoneX}
        clipAboveTo={0}
        clipBelowTo={yMax}
        belowAreaProps={{
          fill: color,
          fillOpacity: 0.1,
        }}
        aboveAreaProps={{
          fill: color,
          fillOpacity: 0.1,
        }}
      />
      <Line
        data={data}
        x={({ stats }) => xScale(stats.genId)}
        y={({ stats }) => (
          yScale(stats.meanFitness - stats.deviation)
        )}
        color={color}
        width={0.3}
      />
      <Line
        data={data}
        x={({ stats }) => xScale(stats.genId)}
        y={({ stats }) => (
          yScale(stats.meanFitness + stats.deviation)
        )}
        color={color}
        width={0.3}
      />
    </>
  );
}

DeviationLine.propTypes = {
  color: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(SimulationType)),
  id: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  yMax: PropTypes.number.isRequired,
};

DeviationLine.defaultProps = {
  data: [],
};

export default DeviationLine;
