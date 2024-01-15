import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { scaleLinear } from '@visx/scale'
import { Grid } from '@visx/grid'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from '@visx/group'
import { MIN_BROWSER_WIDTH, minResultsThreshold } from '../constants/constants'
import CustomCheckbox from '../common/Checkbox'
import { useGetCompletedSimulationReports, useGetCurrentSimulationReport } from '../database/hooks'
import SimulationGraphEntry from '../graph/SimulatonGraphEntry'
import { SimulationGraph } from '../constants/websiteCopy'
import { useWindowSize } from '../navigation/navigationSlice'
import { type SimulationReport } from '../database/types'
import { type RootState } from '../store'
import { type GenerationStats } from '../population/types'
import { defaultParameters } from '../parameters/config'

const { maxGenerations: maxGens } = defaultParameters.stopCriteria
const graphHeight = 450
const margin = {
  left: 30,
  top: 4,
  right: 18,
  bottom: 15
}

const fullHeight = graphHeight + margin.top + margin.bottom

const findMaxGeneration = (simulations: SimulationReport[]): number => {
  let result: number = maxGens
  simulations.forEach(({ simulation }) => {
    const { maxGenerations } = simulation.parameters.stopCriteria
    if (maxGenerations > result) result = maxGenerations
  })
  return result
}

const findMin = (
  stats: GenerationStats,
  showMean: boolean,
  showMin: boolean,
  showDeviation: boolean
): number => {
  const { maxFitness, meanFitness, minFitness, deviation } = stats

  if (showMin && showDeviation) { return Math.min(minFitness, meanFitness - deviation) }
  if (showDeviation) { return meanFitness - deviation }
  if (showMin) { return minFitness }
  if (showMean) { return meanFitness }

  return maxFitness
}

const findMax = (stats: GenerationStats, showDeviation: boolean): number => {
  const { maxFitness, meanFitness, deviation } = stats
  if (showDeviation) {
    return Math.max(maxFitness, meanFitness + deviation)
  }

  return maxFitness
}

const findYDomain = (
  x0: number,
  x1: number,
  simulations: SimulationReport[],
  showMean: boolean,
  showMin: boolean,
  showDeviation: boolean
): number[] => {
  const epsilon = 0.005
  let y0 = -1
  let y1 = -1
  simulations.forEach(({ results }) => {
    let leftBound: number | null = null
    let rightBound: number | null = null
    if (results == null) {
      return
    }

    results.stats.forEach(({ stats }) => {
      const { gen } = stats
      if (gen <= x0) {
        leftBound = stats.minFitness
      }
      if (rightBound == null && gen >= x1) {
        rightBound = stats.maxFitness
      }
      const max = findMax(stats, showDeviation)
      const min = findMin(stats, showMean, showMin, showDeviation)

      if (gen >= x0 && gen <= x1) {
        y0 = y0 < 0 ? min : Math.min(y0, min)
        y1 = y1 < 0 ? max : Math.max(y1, max)
      }
    })
    if (leftBound != null && y0 < 0) {
      y0 = findMin(leftBound, showMean, showMin, showDeviation)
    }
    if (rightBound != null && y1 < 0) {
      y1 = findMax(rightBound, showDeviation)
    }
  })
  if (y0 < 0) y0 = minResultsThreshold
  if (y1 < 0) y1 = 1
  y0 -= epsilon
  y1 += epsilon

  return [y0, y1]
}

function SimulationChart (): JSX.Element {
  const windowSize = useWindowSize()
  const containerRef = useRef<HTMLDivElement>(null)
  const [fullWidth, setFullWidth] = useState(MIN_BROWSER_WIDTH)
  const graphWidth = fullWidth - margin.left - margin.right
  const graphEntries = useSelector((state: RootState) => state.navigation.simulationGraphColors)
  const theme = useTheme()
  const completedSims: SimulationReport[] = useGetCompletedSimulationReports() ?? []
  const currentSim = useGetCurrentSimulationReport()
  const runningStats = useSelector((state: RootState) => state.simulation.runningStatsRecord)
  if (currentSim != null) {
    currentSim.results.stats = runningStats
  }
  // Local state
  const [domainY, setDomainY] = useState([minResultsThreshold, 1])
  const [domainX, setDomainX] = useState([0, maxGens])
  const [showMean, setShowMean] = useState(true)
  const [showDeviation, setShowDeviation] = useState(false)
  const [showMin, setShowMin] = useState(false)

  const bgColor = theme.palette.background.default
  const axisColor = theme.palette.grey[400]
  const isCurrentSimGraphed = currentSim?.simulation.id != null && currentSim.simulation.id in graphEntries
  // Determine which simulations are being graphed
  const checkedSimulations = completedSims.filter(({ simulation }) => (simulation.id != null && simulation.id in graphEntries))
  if (isCurrentSimGraphed) checkedSimulations.push(currentSim)

  useEffect(() => {
    if (containerRef.current == null) return

    const { width } = containerRef.current.getBoundingClientRect()
    setFullWidth(width)
  }, [windowSize])

  const yScale = useMemo(
    () => scaleLinear({
      range: [graphHeight, 0],
      domain: domainY
    }),
    [domainY, windowSize]
  )

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain: domainX
    }),
    [domainX, windowSize]
  )

  const updateDomainY = (): void => {
    const result = findYDomain(
      domainX[0],
      domainX[1],
      checkedSimulations,
      showMean,
      showMin,
      showDeviation
    )

    if (result !== domainY) {
      setDomainY(result)
    }
  }

  // Update X Domain when simulations are checked / unchecked
  useEffect(() => {
    const numGenerations = findMaxGeneration(checkedSimulations)
    if (numGenerations !== domainX[1]) {
      setDomainX([domainX[0], numGenerations])
    }
  }, [graphEntries])

  // Update Y Domain when basically anything about the chart changes
  useEffect(() => {
    updateDomainY()
  }, [graphEntries, showMean, showMin, showDeviation, domainX])

  useEffect(() => {
    if (isCurrentSimGraphed) {
      updateDomainY()
    }
  }, [runningStats])

  return (
    <Stack ref={containerRef}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }} spacing={2}>
        <Typography color="GrayText">
          {SimulationGraph.title}
        </Typography>
        <Box sx={{ display: 'flex' }}>
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
        </Box>
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
          />
          {checkedSimulations.map(({ simulation, results }) => (
            <React.Fragment key={`graph-line-${simulation.id}`}>
              <SimulationGraphEntry
                color={graphEntries[simulation.id as number]}
                id={simulation.id as number}
                graphHeight={graphHeight}
                data={results.stats}
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
            fill={bgColor}
          />
          <rect
            x={-30}
            y={-margin.top}
            width={30}
            height={fullHeight}
            fill={bgColor}
          />
          <rect
            x={0}
            y={graphHeight}
            width={graphWidth}
            height={20}
            fill={bgColor}
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
            dy: 3
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
            textAnchor: 'middle'
          })}
        />
      </svg>
    </Stack>
  )
}

export default SimulationChart
