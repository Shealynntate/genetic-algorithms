import React, { useCallback } from 'react';
import {
  Line, Bar, AreaClosed,
} from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import {
  withTooltip, Tooltip, TooltipWithBounds, defaultStyles,
} from '@visx/tooltip';
// import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { GradientOrangeRed, LinearGradient } from '@visx/gradient';
import { bisector } from 'd3-array';
import { meanFitness, minFitness, maxFitness } from '../models/utils';

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

// accessors
const getGeneration = (d) => d?.x || 0;
const bisectGenerations = bisector((d) => d.x).left;

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

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const generationScale = scaleLinear({
      range: [margin.left, innerWidth + margin.left],
      domain: [0, generations.length],
    });
      // [innerWidth, margin.left],
    const stockValueScale = scaleLinear({
      range: [innerHeight + margin.top, margin.top],
      domain: [0, targetFitness],
      nice: true,
    });

    const data = generations.map((gen, i) => ({
      x: i,
      top: maxFitness(gen),
      mean: meanFitness(gen),
      bottom: minFitness(gen),
    }));

    // tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = generationScale.invert(x);
        const index = bisectGenerations(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && getGeneration(d1)) {
          d = x0 - getGeneration(d0) > getGeneration(d1) - x0 ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(d?.top || 0),
        });
      },
      [showTooltip, stockValueScale, generationScale],
    );

    const tooltipCircle = (cy) => (
      <>
        <circle
          cx={tooltipLeft}
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
          cx={tooltipLeft}
          cy={cy}
          r={4}
          fill={accentColorDark}
          stroke="white"
          strokeWidth={2}
          pointerEvents="none"
        />
      </>
    );

    const tooltipBox = (value, label) => (
      <TooltipWithBounds
        key={Math.random()}
        top={stockValueScale(value) - 12}
        left={tooltipLeft + 12}
        style={tooltipStyles}
      >
        {`${label}: ${value}`}
      </TooltipWithBounds>
    );

    const area = (dataCallback) => (
      <AreaClosed
        data={generations.map((gen, i) => ({ x: i, y: dataCallback(gen) }))}
        x={(d) => generationScale(d.x)}
        y={(d) => stockValueScale(d.y)}
        yScale={stockValueScale}
        strokeWidth={1}
        stroke="url(#area-gradient)"
        fill="url(#area-gradient)"
        curve={curveMonotoneX}
      />
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0} />
          <GradientOrangeRed id="mean-area-gradient" fromOpacity={1} toOpacity={0.1} />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={generationScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          {area(maxFitness)}
          {area(meanFitness)}
          {area(minFitness)}
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
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
              {tooltipCircle(stockValueScale(tooltipData.top))}
              {tooltipCircle(stockValueScale(tooltipData.mean))}
              {tooltipCircle(stockValueScale(tooltipData.bottom))}
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            {tooltipBox(tooltipData.top, 'Top')}
            {tooltipBox(tooltipData.mean, 'Mean')}
            {tooltipBox(tooltipData.bottom, 'Bottom')}
            <Tooltip
              top={innerHeight + margin.top - 14}
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
