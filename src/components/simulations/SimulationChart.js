import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { Stack, Typography } from '@mui/material';
import { minResultsThreshold } from '../../constants/constants';
import defaultParameters from '../../constants/defaultParameters';
import CustomCheckbox from '../common/Checkbox';
import ChartBrush from '../graph/ChartBrush';
import { useGetCompletedSimulationsAndResults, useGetCurrentSimulation } from '../../global/database';
import SimulationGraphEntry from '../graph/SimulatonGraphEntry';
import { SimulationGraph } from '../../constants/websiteCopy';

const { maxGenerations: maxGens } = defaultParameters.stopCriteria;
const graphWidth = 625;
const graphHeight = 500;
const brushHeight = 100;
const margin = {
  left: 30,
  top: 4,
  right: 18,
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
  let result = maxGens;
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
    if (!results) {
      return;
    }

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

  return [y0, y1];
};

function SimulationChart() {
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  const theme = useTheme();
  const completedSims = useGetCompletedSimulationsAndResults() || [];
  const currentSim = useGetCurrentSimulation();
  const runningStats = useSelector((state) => state.simulation.runningStatsRecord);
  if (currentSim) currentSim.results = runningStats;
  // Local state
  const [domainY, setDomainY] = useState([minResultsThreshold, 1]);
  const [domainX, setDomainX] = useState([0, maxGens]);
  const [showMean, setShowMean] = useState(true);
  const [showDeviation, setShowDeviation] = useState(false);
  const [showMin, setShowMin] = useState(false);

  const bgColor = theme.palette.background.default;
  const maskColor = theme.palette.background.mask[0];
  const axisColor = theme.palette.grey[400];
  const isCurrentSimGraphed = currentSim && currentSim.id in graphEntries;
  // Determine which simulations are being graphed
  const checkedSimulations = completedSims.filter(({ id }) => (id in graphEntries));
  if (isCurrentSimGraphed) checkedSimulations.push(currentSim);

  const yScale = useMemo(
    () => scaleLinear({
      range: [graphHeight, 0],
      domain: domainY,
    }),
    [domainY],
  );

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain: domainX,
    }),
    [domainX],
  );

  const updateDomainY = () => {
    const result = findYDomain(
      domainX[0],
      domainX[1],
      checkedSimulations,
      { showDeviation, showMean, showMin },
    );

    if (result !== domainY) {
      setDomainY(result);
    }
  };

  // Update X Domain when simulations are checked / unchecked
  useEffect(() => {
    const numGenerations = findMaxGeneration(checkedSimulations);
    if (numGenerations !== domainX[1]) {
      setDomainX([domainX[0], numGenerations]);
    }
  }, [graphEntries]);

  // Update Y Domain when basically anything about the chart changes
  useEffect(() => {
    updateDomainY();
  }, [graphEntries, showMean, showMin, showDeviation, domainX]);

  useEffect(() => {
    if (isCurrentSimGraphed) {
      updateDomainY();
    }
  }, [runningStats]);

  const onChangeDomain = (x0, x1) => {
    setDomainX([x0, x1]);
  };

  return (
    <Stack>
      <Typography color="GrayText" sx={{ textAlign: 'center' }}>
        {SimulationGraph.title}
      </Typography>
      <Stack direction="row" sx={{ justifyContent: 'end', pr: 2 }} spacing={2}>
        <CustomCheckbox
          label={SimulationGraph.meanCheckbox}
          checked={showMean}
          onCheck={setShowMean}
        />
        <CustomCheckbox
          label={SimulationGraph.minCheckbox}
          checked={showMin}
          onCheck={setShowMin}
        />
        <CustomCheckbox
          label={SimulationGraph.deviationCheckbox}
          checked={showDeviation}
          onCheck={setShowDeviation}
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
              <SimulationGraphEntry
                color={graphEntries[id]}
                id={id}
                graphHeight={graphHeight}
                data={results}
                showDeviation={showDeviation}
                showMean={showMean}
                showMin={showMin}
                xScale={xScale}
                yScale={yScale}
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
          maxGenerations={findMaxGeneration(checkedSimulations)}
          margin={brushMargin}
          simulations={checkedSimulations}
          setDomain={onChangeDomain}
          showRunningSim={isCurrentSimGraphed}
        />
      </svg>
    </Stack>
  );
}

export default SimulationChart;
