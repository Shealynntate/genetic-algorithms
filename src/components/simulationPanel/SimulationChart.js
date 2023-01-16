import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { minExperimentThreshold } from '../../constants';
import ExperimentLine from '../ExperimentLine';
import { ParametersType } from '../../types';

const graphWidth = 650;
const graphHeight = 500;
const maxGenerations = 20_000;

const margin = {
  left: 28,
  top: 4,
  right: 14,
  bottom: 15,
};

const fullWidth = graphWidth + margin.left + margin.right;
const fullHeight = graphHeight + margin.top + margin.bottom;

function SimulationChart({ simulations }) {
  const theme = useTheme();

  const bgColor = theme.palette.background.default;
  const axisColor = theme.palette.grey[400];

  const lineColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,

    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.error.light,
    theme.palette.warning.light,
    theme.palette.info.light,
    theme.palette.success.light,

    theme.palette.primary.dark,
    theme.palette.secondary.dark,
    theme.palette.error.dark,
    theme.palette.warning.dark,
    theme.palette.info.dark,
    theme.palette.success.dark,
  ];

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
      domain: [100, maxGenerations],
    }),
    [],
  );

  return (
    <svg width={fullWidth} height={fullHeight}>
      <Group top={margin.top} left={margin.left}>
        <rect
          x={0}
          y={0}
          width={graphWidth}
          height={graphHeight}
          fill={bgColor}
          rx={theme.shape.borderRadius}
        />
        <Grid
          xScale={xScale}
          yScale={yScale}
          width={graphWidth}
          height={graphHeight}
          stroke="white"
          strokeOpacity={0.10}
        />
        {simulations.map(({ id, results }, index) => (
          <ExperimentLine
            key={`graph-${id}`}
            data={genData(results)}
            xScale={xScale}
            yScale={yScale}
            color={lineColors[index % lineColors.length]}
          />
        ))}
      </Group>
      <AxisLeft
        scale={yScale}
        top={margin.top}
        left={margin.left}
        tickValues={yScale.ticks()}
        tickStroke={axisColor}
        tickLength={4}
        tickLabelProps={() => ({
          fill: axisColor,
          fontSize: 9,
          textAnchor: 'end',
          dx: -1,
          dy: 3,
        })}
      />
      <AxisBottom
        scale={xScale}
        top={fullHeight - margin.bottom}
        left={margin.left}
        tickValues={xScale.ticks()}
        tickStroke={axisColor}
        tickLength={4}
        tickLabelProps={() => ({
          fill: axisColor,
          fontSize: 9,
          textAnchor: 'middle',
        })}
      />
    </svg>
  );
}

SimulationChart.propTypes = {
  simulations: PropTypes.arrayOf(
    PropTypes.shape(ParametersType),
  ),
};

SimulationChart.defaultProps = {
  simulations: [],
};

export default SimulationChart;
