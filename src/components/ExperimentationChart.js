import React, { useCallback, useMemo } from 'react';
import { Typography } from '@mui/material';
import { localPoint } from '@visx/event';
import { scaleLinear } from '@visx/scale';
// import { useTheme } from '@emotion/react';
import { TooltipWithBounds, withTooltip } from '@visx/tooltip';
import PropTypes from 'prop-types';
import { Bar } from '@visx/shape';
import { useGetAllExperiments } from '../globals/database';
import { minExperimentThreshold } from '../constants';
import ExperimentLine from './ExperimentLine';

const graphWidth = 600;
const graphHeight = 400;

const ExperimentationChart = withTooltip(({
  data,
  tooltipData,
  showTooltip,
  hideTooltip,
}) => {
  const experiments = useGetAllExperiments() || [];
  // const theme = useTheme();

  const genData = (results) => results.map(({ stats }) => ({
    x: stats.genId,
    y: stats.maxFitness,
  }));

  const yScale = useMemo(
    () => scaleLinear({
      range: [graphHeight, 0],
      domain: [minExperimentThreshold, 1],
    }),
    [],
  );

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain: [100, 16000],
    }),
    [],
  );

  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = Math.round(x0);
      const d = data[index];
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(d?.top || 0),
      });
    },
    [showTooltip, yScale, xScale],
  );

  return (
    <>
      <svg width={graphWidth} height={graphHeight}>
        {experiments.map(({ id, results }) => (
          <ExperimentLine
            key={`graph-${id}`}
            data={genData(results)}
            xScale={xScale}
            yScale={yScale}
          />
        ))}
        <Bar
          x={0}
          y={0}
          width={graphWidth}
          height={graphHeight}
          fill="transparent"
          rx={5}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
      </svg>
      {tooltipData && (
        <TooltipWithBounds>
          <Typography>hello friend</Typography>
        </TooltipWithBounds>
      )}
    </>
  );
});

ExperimentationChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
};

ExperimentationChart.defaultProps = {
  data: [],
};

export default ExperimentationChart;
