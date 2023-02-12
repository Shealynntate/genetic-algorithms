import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { Stack, Typography } from '@mui/material';
import { minResultsThreshold } from '../../constants';
import defaultParameters from '../../globals/defaultParameters';
import CustomCheckbox from './Checkbox';
import ChartBrush from './ChartBrush';
import { useGetCompletedSimulationsAndResults, useGetCurrentSimulation } from '../../globals/database';
import DeviationLine from '../Charts/DeviationLine';
import Line from '../Charts/Line';

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

const findMin = (stats, settings) => {
  const {
    maxFitness, meanFitness, minFitness, deviation,
  } = stats;
  const { showMean, showMin, showDeviation } = settings;

  if (showMin && showDeviation) { return Math.min(minFitness, meanFitness - deviation); }
  if (showDeviation) { return meanFitness - deviation; }
  if (showMin) { return minFitness; }
  if (showMean) { return meanFitness; }
  return maxFitness;
};

const findMax = (stats, settings) => {
  const { maxFitness, meanFitness, deviation } = stats;
  const { showDeviation } = settings;

  if (showDeviation) { return Math.max(maxFitness, meanFitness + deviation); }

  return maxFitness;
};

const findYDomain = (x0, x1, simulations, settings) => {
  const epsilon = 0.005;
  let y0 = -1;
  let y1 = -1;
  simulations.forEach(({ results }) => {
    let leftBound = null;
    let rightBound = null;
    results.forEach(({ stats }) => {
      const { genId } = stats;
      if (genId <= x0) leftBound = stats;
      if (rightBound == null && genId >= x1) rightBound = stats;
      const max = findMax(stats, settings);
      const min = findMin(stats, settings);

      if (genId >= x0 && genId <= x1) {
        y0 = y0 < 0 ? min : Math.min(y0, min);
        y1 = y1 < 0 ? max : Math.max(y1, max);
      }
    });
    if (leftBound && y0 < 0) {
      y0 = findMin(leftBound, settings);
    }
    if (rightBound && y1 < 0) {
      y1 = findMax(rightBound, settings);
    }
  });
  if (y0 < 0) y0 = minResultsThreshold;
  if (y1 < 0) y1 = 1;
  y0 -= epsilon;
  y1 += epsilon;

  return { y0, y1 };
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
  const checkedSimulations = simulations.filter(({ id }) => (id in graphEntries));
  const numGenerations = findMaxGeneration(checkedSimulations);

  const [showMean, setShowMean] = useState(true);
  const [showDeviation, setShowDeviation] = useState(false);
  const [showMin, setShowMin] = useState(false);
  const [domain, setDomain] = useState({
    x0: 0,
    x1: numGenerations,
    y0: minResultsThreshold,
    y1: 1,
  });

  const bgColor = theme.palette.background.default;
  const maskColor = theme.palette.background.mask[0];
  const axisColor = theme.palette.grey[400];

  const yScale = useMemo(
    () => scaleLinear({
      range: [graphHeight, 0],
      domain: [domain.y0, domain.y1],
    }),
    [domain],
  );

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain: [domain.x0, domain.x1],
    }),
    [domain],
  );

  useEffect(() => {
    const yDomain = findYDomain(
      domain.x0,
      domain.x1,
      checkedSimulations,
      { showDeviation, showMean, showMin },
    );
    setDomain({ ...domain, ...yDomain });
  }, [checkedSimulations]);

  const onChangeDomain = (x0, x1) => {
    const yDomain = findYDomain(
      x0,
      x1,
      checkedSimulations,
      { showDeviation, showMean, showMin },
    );
    setDomain({ x0, x1, ...yDomain });
  };

  const onCheckValue = (key, value) => {
    const yDomain = findYDomain(
      domain.x0,
      domain.x1,
      checkedSimulations,
      {
        showDeviation, showMean, showMin, [key]: value,
      },
    );
    setDomain({ ...domain, ...yDomain });
  };

  const onCheckMean = (v) => {
    setShowMean(v);
    onCheckValue('showMean', v);
  };

  const onCheckMin = (v) => {
    setShowMin(v);
    onCheckValue('showMin', v);
  };

  const onCheckDeviation = (v) => {
    setShowDeviation(v);
    onCheckValue('showDeviation', v);
  };

  return (
    <Stack>
      <Typography color="GrayText" sx={{ textAlign: 'center' }}>
        Simulation Fitness vs Generations
      </Typography>
      <Stack direction="row" sx={{ justifyContent: 'end', pr: 2 }} spacing={2}>
        <CustomCheckbox
          label="Mean"
          checked={showMean}
          onCheck={onCheckMean}
        />
        <CustomCheckbox
          label="Min"
          checked={showMin}
          onCheck={onCheckMin}
        />
        <CustomCheckbox
          label="Deviation"
          checked={showDeviation}
          onCheck={onCheckDeviation}
        />
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
              {showMean && (
                <Line
                  data={results}
                  x={({ stats }) => xScale(stats.genId)}
                  y={({ stats }) => yScale(stats.meanFitness)}
                  color={graphEntries[id]}
                  type="dashed"
                  width={0.8}
                />
              )}
              {showDeviation && (
                <DeviationLine
                  id={id}
                  data={results}
                  color={graphEntries[id]}
                  xScale={xScale}
                  yScale={yScale}
                  yMax={graphHeight}
                />
              )}
              {showMin && (
                <Line
                  data={results}
                  x={({ stats }) => xScale(stats.genId)}
                  y={({ stats }) => yScale(stats.minFitness)}
                  color={graphEntries[id]}
                  width={0.4}
                />
              )}
              <Line
                data={results}
                x={({ stats }) => xScale(stats.genId)}
                y={({ stats }) => yScale(stats.maxFitness)}
                color={graphEntries[id]}
                width={1}
              />
            </React.Fragment>
          ))}
          <rect
            x={graphWidth}
            y={-margin.top}
            width={20}
            height={fullHeight}
            fill={maskColor}
          />
          <rect
            x={-30}
            y={-margin.top}
            width={30}
            height={fullHeight}
            fill={maskColor}
          />
          <rect
            x={0}
            y={graphHeight}
            width={graphWidth}
            height={20}
            fill={maskColor}
          />
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
