import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { Stack, Typography } from '@mui/material';
import { minResultsThreshold } from '../../constants';
import ExperimentLine from '../ExperimentLine';
import defaultParameters from '../../globals/defaultParameters';
import CustomCheckbox from './Checkbox';
import ChartBrush from './ChartBrush';
import { useGetCompletedSimulationsAndResults, useGetCurrentSimulation } from '../../globals/database';

const graphWidth = 625;
const graphHeight = 500;
const brushHeight = 100;
const margin = {
  left: 28,
  top: 4,
  right: 14,
  bottom: 15,
};
const brushMargin = {
  left: 28,
  top: 0,
  right: 0,
  bottom: 0,
};

const fullWidth = graphWidth + margin.left + margin.right;
const fullHeight = graphHeight + margin.top + margin.bottom;

const findMaxGeneration = (simulations) => {
  let result = defaultParameters.stopCriteria.maxGenerations;
  simulations.forEach(({ parameters }) => {
    const { maxGenerations } = parameters.stopCriteria;
    if (maxGenerations > result) result = maxGenerations;
  });
  return result;
};

function SimulationChart() {
  const theme = useTheme();
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  const runningStats = useSelector((state) => state.simulation.runningStatsRecord);
  const completedSims = useGetCompletedSimulationsAndResults() || [];
  const currentSim = useGetCurrentSimulation();
  const simulations = [...completedSims];
  if (currentSim) {
    currentSim.results = runningStats;
    simulations.push(currentSim);
  }

  const numGenerations = findMaxGeneration(simulations);
  const [showMean, setShowMean] = useState(true);
  const [domain, setDomain] = useState([0, numGenerations]);

  const bgColor = theme.palette.background.default;
  const axisColor = theme.palette.grey[400];

  const isGraphed = (id) => (id in graphEntries);

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
      domain: [minResultsThreshold, 1],
    }),
    [],
  );

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain,
    }),
    [domain],
  );

  const onChangeDomain = (x0, x1) => {
    setDomain([x0, x1]);
  };

  const checkedSimulations = simulations.filter(({ id }) => isGraphed(id));

  return (
    <Stack>
      <Typography color="GrayText" sx={{ textAlign: 'center' }}>
        Simulation Fitness vs Generations
      </Typography>
      <Stack direction="row" sx={{ justifyContent: 'end', pr: 2 }} spacing={2}>
        <CustomCheckbox label="Mean" checked={showMean} onCheck={setShowMean} />
        <CustomCheckbox label="Variance" />
      </Stack>
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
          {checkedSimulations.map(({ id, results }) => (
            <React.Fragment key={`graph-line-${id}`}>
              <ExperimentLine
                data={getMaxData(results)}
                xScale={xScale}
                yScale={yScale}
                color={graphEntries[id]}
              />
              {showMean && (
                <ExperimentLine
                  data={getMeanData(results)}
                  xScale={xScale}
                  yScale={yScale}
                  color={graphEntries[id]}
                  type="dashed"
                />
              )}
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
      <svg
        width={fullWidth}
        height={brushHeight}
        style={{ marginTop: '0.6rem' }}
      >
        <ChartBrush
          width={graphWidth}
          height={brushHeight}
          maxFitness={1}
          maxGenerations={numGenerations}
          margin={brushMargin}
          simulations={checkedSimulations}
          setDomain={onChangeDomain}
        />
      </svg>
    </Stack>
  );
}

export default SimulationChart;
