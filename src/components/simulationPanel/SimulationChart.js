import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { getGraphColor, minExperimentThreshold } from '../../constants';
import ExperimentLine from '../ExperimentLine';
import { getSimulations } from '../../globals/database';

const graphWidth = 625;
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

function SimulationChart() {
  const theme = useTheme();
  const graphEntries = useSelector((state) => state.ux.simulationGraphEntries);
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    const fetchSimulations = async () => {
      const keys = Object.keys(graphEntries).map((k) => parseInt(k, 10));
      const entries = await getSimulations(keys);
      setSimulations(entries);
    };
    fetchSimulations();
  }, [graphEntries]);

  const bgColor = theme.palette.background.default;
  const axisColor = theme.palette.grey[400];

  const getMaxData = (results) => results.map(({ stats }) => ({
    x: stats.genId,
    y: stats.maxFitness,
  }));

  const getMeanData = (results) => results.map(({ stats }) => ({
    x: stats.genId,
    y: stats.meanFitness,
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
        {simulations.map(({ id, results }) => (
          <React.Fragment key={`graph-line-${id}`}>
            <ExperimentLine
              data={getMaxData(results)}
              xScale={xScale}
              yScale={yScale}
              color={getGraphColor(graphEntries[id])}
            />
            <ExperimentLine
              data={getMeanData(results)}
              xScale={xScale}
              yScale={yScale}
              color={getGraphColor(graphEntries[id])}
              type="dashed"
            />
          </React.Fragment>
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

export default SimulationChart;
