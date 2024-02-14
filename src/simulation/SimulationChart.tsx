import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { clamp } from 'lodash'
import { useSelector } from 'react-redux'
import { scaleLinear, scaleLog } from '@visx/scale'
import { Grid } from '@visx/grid'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from '@visx/group'
import { MIN_BROWSER_WIDTH } from '../navigation/config'
import CustomCheckbox from '../common/Checkbox'
import { useGetCompletedSimulationReports, useGetCurrentSimulationReport } from '../database/hooks'
import SimulationGraphEntry from '../graph/SimulatonGraphEntry'
import { useWindowSize } from '../navigation/hooks'
import { type SimulationReport } from '../database/types'
import { type RootState } from '../store'
import { type Point } from '@visx/brush/lib/types'
import { defaultParameters } from '../parameters/config'
import { localPoint } from '@visx/event'
import { SimulationGraph } from './types'

const { maxGenerations: maxGens } = defaultParameters.stopCriteria
const graphHeight = 350
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

function SimulationChart (): JSX.Element {
  const windowSize = useWindowSize()
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<SVGSVGElement>(null)
  const [fullWidth, setFullWidth] = useState(MIN_BROWSER_WIDTH)
  const graphWidth = fullWidth - margin.left - margin.right
  const graphEntries = useSelector((state: RootState) => state.navigation.simulationGraphColors)
  const theme = useTheme()
  const completedSims: SimulationReport[] = useGetCompletedSimulationReports() ?? []
  const currentSim = useGetCurrentSimulationReport()
  // Local state
  const [domainY, setDomainY] = useState([0.5, 1])
  const [domainX, setDomainX] = useState([1, maxGens])
  const [showMean, setShowMean] = useState(true)
  const [showDeviation, setShowDeviation] = useState(false)
  const [showMin, setShowMin] = useState(false)
  const [lastMousePos, setLastMousePos] = useState<Point | null>(null)

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
    () => scaleLog({
      range: [0, graphWidth],
      domain: domainX
    }),
    [domainX, windowSize, graphWidth]
  )

  const buffer = [20, 0.01]
  const handleWheel = (event: React.WheelEvent): void => {
    // Treat mousePos as center of zoom in point
    const mousePos = localPoint(event)
    if (mousePos == null) return
    // Negative deltaY means zoom in
    const sign = Math.sign(event.deltaY)
    const value = Math.log(Math.abs(event.deltaY))
    const zoomFactor = [1 + sign * value / 40, 1 + sign * value / 100]
    const x = mousePos.x - margin.left
    const y = mousePos.y + margin.top
    const gen = clamp(Math.round(xScale.invert(x)), 0, maxGens)
    const fitness = clamp(yScale.invert(y), 0, 1)

    const max = findMaxGeneration(checkedSimulations)
    const x0 = clamp(xScale.invert(x - x * zoomFactor[0]), 0, Math.max(gen - buffer[0], 0))
    const x1 = clamp(xScale.invert(x + (graphWidth - x) * zoomFactor[0]), Math.min(gen + buffer[0], max), max)
    const y0 = clamp(yScale.invert(y + (graphHeight - y) * zoomFactor[1]), 0, Math.max(fitness - buffer[1], 0))
    const y1 = clamp(yScale.invert(y - y * zoomFactor[1]), Math.min(fitness + buffer[1], 1), 1)
    setDomainX([x0, x1])
    setDomainY([y0, y1])
  }

  const onMouseDown = (event: React.MouseEvent): void => {
    const mousePos = localPoint(event)
    if (mousePos !== null) {
      setLastMousePos({ y: mousePos.y - margin.top, x: mousePos.x - margin.left })
    }
  }

  const onMouseUp = (event: React.MouseEvent): void => {
    setLastMousePos(null)
  }

  const onMouseMove = (event: React.MouseEvent): void => {
    // Use the mouse position to pan the graph
    const mousePos = localPoint(event)
    if (lastMousePos == null || mousePos == null) return

    const x = mousePos.x - margin.left
    const y = mousePos.y - margin.top
    const maxGens = findMaxGeneration(checkedSimulations)
    const deltaX = clamp(xScale.invert(lastMousePos.x) - xScale.invert(x), -domainX[0], maxGens - domainX[1])
    const deltaY = clamp(yScale.invert(lastMousePos.y) - yScale.invert(y), -domainY[0], 1 - domainY[1])
    const x0 = clamp(deltaX + domainX[0], 0, maxGens - buffer[0])
    const x1 = clamp(deltaX + domainX[1], buffer[0], maxGens)
    const y0 = clamp(deltaY + domainY[0], 0, 1 - buffer[1])
    const y1 = clamp(deltaY + domainY[1], buffer[1], 1)
    setLastMousePos({ y, x })
    setDomainX([x0, x1])
    setDomainY([y0, y1])
  }

  useEffect(() => {
    if (graphRef.current == null) return

    const onWheelCapture = (event: WheelEvent): void => {
      // This is a hack to prevent the page from scrolling when the user is zooming in/out
      event.preventDefault()
      event.stopPropagation()
    }
    graphRef.current.addEventListener('wheel', onWheelCapture, { passive: false })

    return () => {
      if (graphRef.current == null) return
      graphRef.current.removeEventListener('wheel', onWheelCapture)
    }
  }, [])

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
        <Group
          top={margin.top}
          left={margin.left}
          innerRef={graphRef}
          onWheelCapture={handleWheel}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
        >
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
            numTicksColumns={0}
          />
          {checkedSimulations.map(({ simulation, results }) => (
            <React.Fragment key={`graph-line-${simulation.id}`}>
              <SimulationGraphEntry
                color={graphEntries[simulation.id as number]}
                id={simulation.id as number}
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
