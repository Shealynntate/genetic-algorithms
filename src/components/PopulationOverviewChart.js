/* eslint-disable no-unused-vars */
import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  Line, Bar, AreaClosed, LinePath,
} from '@visx/shape';
import { Brush } from '@visx/brush';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import {
  withTooltip, Tooltip, TooltipWithBounds, defaultStyles,
} from '@visx/tooltip';
// import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { bisector } from 'd3-array';
import { useTheme } from '@emotion/react';
import { PatternLines } from '@visx/pattern';
import { meanFitness, minFitness, maxFitness } from '../models/utils';
import PopulationOverviewBrush from './PopulationOverviewBrush';

export class OverviewDataEntry {
  constructor(x, top, mean, bottom) {
    this.x = x;
    this.top = top;
    this.mean = mean;
    this.bottom = bottom;
  }
}

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
  opacity: 0.6,
};

const tooltipCircle = (cx, cy) => (
  <>
    <circle
      cx={cx}
      cy={cy + 1}
      r={4}
      fill="black"
      fillOpacity={0.1}
      stroke="black"
      strokeOpacity={0.1}
      strokeWidth={2}
      pointerEvents="none"
    />
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={accentColorDark}
      stroke="white"
      strokeWidth={2}
      pointerEvents="none"
    />
  </>
);

// accessors
const getGeneration = (d) => d?.x || 0;
const bisectGenerations = bisector((d) => d.x).left;

const chartSeparation = 5;
// const brushMargin = {
//   top: 5, bottom: 5, left: 20, right: 20,
// };
const PATTERN_ID = 'brush_pattern';
// const GRADIENT_ID = 'brush_gradient';
const selectedBrushStyle = (theme) => ({
  fill: `url(#${PATTERN_ID})`,
  stroke: theme.palette.grey[400],
});

export default withTooltip(
  ({
    width,
    height,
    margin = {
      top: 0, right: 0, bottom: 0, left: 0,
    },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    targetFitness = 0,
    generations = [],
  }) => {
    if (width < 10) return null;

    const data = generations.map((gen, i) => ({
      x: i,
      top: maxFitness(gen),
      mean: meanFitness(gen),
      bottom: minFitness(gen),
    }));

    const theme = useTheme();
    const brushRef = useRef();
    const [filteredData, setFilteredData] = useState(data);

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const topChartHeight = 0.8 * innerHeight - chartSeparation;
    const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;
    // const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0);
    // const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);

    const brushMargin = {
      top: 5 + topChartHeight + chartSeparation, bottom: 5, left: 20, right: 20,
    };
    // scales
    const xScale = useMemo(
      () => scaleLinear({
        range: [margin.left, innerWidth + margin.left],
        domain: [0, filteredData.length - 1],
      }),
      [filteredData],
    );

    const yScale = useMemo(
      () => scaleLinear({
        range: [topChartHeight, 0],
        domain: [0, targetFitness],
        nice: true,
      }),
      [],
    );

    // const brushXScale = useMemo(
    //   () => scaleLinear({
    //     range: [0, xBrushMax],
    //     domain: [0, generations.length - 1],
    //   }),
    //   [xBrushMax, generations],
    // );

    // const brushYScale = useMemo(
    //   () => scaleLinear({
    //     range: [yBrushMax, 0],
    //     domain: [0, targetFitness],
    //     nice: true,
    //   }),
    //   [yBrushMax],
    // );

    // const initialBrushPosition = useMemo(
    //   () => {
    //     const startGen = Math.max(data.length - 12, 0);
    //     const endGen = Math.max(data.length - 1, 0);
    //     return {
    //       start: { x: brushXScale(startGen) },
    //       end: { x: brushXScale(endGen) },
    //     };
    //   },
    //   [brushXScale],
    // );

    // const onBrushChange = (domain) => {
    //   if (!domain) return;
    //   const { x0, x1 } = domain;
    //   const dataSubset = data.filter((item) => item.x >= x0 && item.x <= x1);
    //   setFilteredData(dataSubset);
    // };
    // We need to manually offset the handles for them to be rendered at the right position

    // eslint-disable-next-line react/prop-types, no-shadow
    function BrushHandle({ x, height, isBrushActive }) {
      const pathWidth = 8;
      const pathHeight = 15;
      if (!isBrushActive) {
        return null;
      }
      return (
        <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
          <path
            fill="#f2f2f2"
            d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
            stroke="#999999"
            strokeWidth="1"
            style={{ cursor: 'ew-resize' }}
          />
        </Group>
      );
    }

    // tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x);
        const index = Math.round(x0);
        const d = filteredData[index];
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: yScale(d?.top || 0),
        });
      },
      [showTooltip, yScale, xScale],
    );

    const tooltipBox = (value, label) => (
      <TooltipWithBounds
        key={Math.random()}
        top={yScale(value) - 12}
        left={tooltipLeft + 12}
        style={tooltipStyles}
      >
        {`${label}: ${value}`}
      </TooltipWithBounds>
    );

    const area = (key) => {
      const lineData = filteredData.map((gen, i) => ({ x: i, y: gen[key] }));
      return (
        <>
          <LinePath
            data={lineData}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
            strokeWidth={1}
            stroke={theme.palette.primary.light}
            curve={curveMonotoneX}
            shapeRendering="geometricPrecision"
          />
          <AreaClosed
            data={lineData}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
            yScale={yScale}
            fillOpacity={0.08}
            // strokeWidth={1}
            // stroke="url(#area-gradient)"
            fill="url(#line-gradient)"
            curve={curveMonotoneX}
            // shapeRendering="geometricPrecision"
          />
          {lineData.map((entry) => (
            <circle
              key={entry.x}
              cx={xScale(entry.x)}
              cy={yScale(entry.y)}
              r={1.5}
              stroke={theme.palette.primary.light}
              opacity={0.3}
              // stroke="rgba(0, 0, 0, 0.5)"
              // fill="transparent"
            />
          ))}
        </>
      );
    };

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={theme.palette.background.paper}
            rx={5}
          />
          <LinearGradient
            id="area-gradient"
            from={theme.palette.primary.main}
            to={theme.palette.primary.main}
            toOpacity={0.2}
          />
          <LinearGradient
            id="line-gradient"
            from={theme.palette.primary.light}
            to={theme.palette.primary.light}
            // fromOpacity={0.2}
            // toOpacity={0}
            // toOffset="50%"
          />
          {/* <GridRows
            left={margin.left}
            scale={yScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={theme.palette.primary.dark}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={xScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={theme.palette.primary.dark}
            strokeOpacity={0.2}
            pointerEvents="none"
          /> */}
          {area('top')}
          {area('mean')}
          {area('bottom')}
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={5}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              {tooltipCircle(tooltipLeft, yScale(tooltipData.top))}
              {tooltipCircle(tooltipLeft, yScale(tooltipData.mean))}
              {tooltipCircle(tooltipLeft, yScale(tooltipData.bottom))}
            </g>
          )}
          {/* <Group left={brushMargin.left} top={topChartHeight + margin.top + chartSeparation}>
            <AreaClosed
              data={generations.map((gen, i) => ({ x: i, y: meanFitness(gen) }))}
              x={(d) => brushXScale(d.x)}
              y={(d) => brushYScale(d.y)}
              yScale={brushYScale}
              strokeWidth={1}
              stroke="url(#area-gradient)"
              fill="url(#area-gradient)"
              curve={curveMonotoneX}
            />
            <PatternLines
              id={PATTERN_ID}
              height={8}
              width={8}
              stroke={theme.palette.primary.light}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <Brush
              xScale={brushXScale}
              yScale={brushYScale}
              width={xBrushMax}
              height={yBrushMax}
              margin={brushMargin}
              handleSize={8}
              innerRef={brushRef}
              resizeTriggerAreas={['left', 'right']}
              brushDirection="horizontal"
              initialBrushPosition={initialBrushPosition}
              onChange={onBrushChange}
              onClick={() => setFilteredData()}
              selectedBoxStyle={selectedBrushStyle(theme)}
              useWindowMoveEvents
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderBrushHandle={(props) => <BrushHandle {...props} />}
            />
          </Group> */}
          <PopulationOverviewBrush
            data={data}
            margin={brushMargin}
            width={width}
            height={height}
            maxFitness={targetFitness}
            setFilteredData={setFilteredData}
          />
        </svg>
        {tooltipData && (
          <div>
            {tooltipBox(tooltipData.top, 'Top')}
            {tooltipBox(tooltipData.mean, 'Mean')}
            {tooltipBox(tooltipData.bottom, 'Bottom')}
            <Tooltip
              top={innerHeight + margin.top - 5}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {`Generation ${tooltipData.x}`}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
