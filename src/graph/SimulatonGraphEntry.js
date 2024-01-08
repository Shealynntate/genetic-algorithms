import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ResultsType } from '../constants/propTypes';
import DeviationLine from './DeviationLine';
import Line from './Line';
import theme from '../theme';

const meanLineWidth = 0.8;
const minLineWidth = 0.4;

function SimulationGraphEntry({
  color,
  data,
  id,
  graphHeight,
  showDeviation,
  showMean,
  showMin,
  xScale,
  yScale,
}) {
  return (
    <>
      {showMean && (
        <Line
          data={data}
          x={({ stats }) => xScale(stats.genId)}
          y={({ stats }) => yScale(stats.meanFitness)}
          color={color}
          type="dashed"
          width={meanLineWidth}
        />
      )}
      {showDeviation && (
        <DeviationLine
          id={id}
          data={data}
          color={color}
          xScale={xScale}
          yScale={yScale}
          yMax={graphHeight}
        />
      )}
      {showMin && (
        <Line
          data={data}
          x={({ stats }) => xScale(stats.genId)}
          y={({ stats }) => yScale(stats.minFitness)}
          color={color}
          width={minLineWidth}
        />
      )}
      <Line
        data={data}
        color={color}
        x={({ stats }) => xScale(stats.genId)}
        y={({ stats }) => yScale(stats.maxFitness)}
      />
    </>
  );
}

SimulationGraphEntry.propTypes = {
  color: PropTypes.string,
  id: PropTypes.number.isRequired,
  graphHeight: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(ResultsType)).isRequired,
  showDeviation: PropTypes.bool,
  showMean: PropTypes.bool,
  showMin: PropTypes.bool,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

SimulationGraphEntry.defaultProps = {
  color: theme.palette.primary.main,
  showDeviation: false,
  showMean: false,
  showMin: false,
};

export default memo(SimulationGraphEntry);
