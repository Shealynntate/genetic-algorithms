/* eslint-disable react/prop-types */
import React, {
  useCallback, useMemo, useState,
} from 'react';
import {
  Line, Bar, AreaClosed, LinePath,
} from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import {
  Tooltip, TooltipWithBounds, defaultStyles, withTooltip,
} from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { useTheme } from '@emotion/react';
import { meanFitness, minFitness, maxFitness } from '../models/utils';
import PopulationOverviewBrush from './PopulationOverviewBrush';

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

const chartSeparation = 5;

export default withTooltip(
  ({
    margin = {
      top: 0, right: 0, bottom: 0, left: 0,
    },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    targetFitness = 0,
    generations = [],
    parentRef,
  }) => {
    const width = parentRef?.clientWidth;
    const height = parentRef?.clientHeight;

    if (!parentRef || width < 10) return null;

    const data = generations.map((gen, i) => ({
      x: i,
      top: maxFitness(gen),
      mean: meanFitness(gen),
      bottom: minFitness(gen),
    }));

    const theme = useTheme();
    const [filteredData, setFilteredData] = useState(data);

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const topChartHeight = 0.8 * innerHeight - chartSeparation;
    const brushMargin = {
      top: 5 + topChartHeight + chartSeparation,
      bottom: 5,
      left: 20,
      right: 20,
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
            fill="url(#line-gradient)"
            curve={curveMonotoneX}
          />
          {lineData.map((entry) => (
            <circle
              key={entry.x}
              cx={xScale(entry.x)}
              cy={yScale(entry.y)}
              r={1.5}
              stroke={theme.palette.primary.light}
              opacity={0.3}
            />
          ))}
        </>
      );
    };

    return (
      <>
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
          />
          <GridRows
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
          />
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
      </>
    );
  },
);
