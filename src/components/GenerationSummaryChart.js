/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withTooltip } from '@visx/tooltip';
import { Bar, Line } from '@visx/shape';
import { GradientOrangeRed, LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { deviation, mean } from 'd3-array';
import { GridColumns } from '@visx/grid';
import Organism from '../models/organism';
import { genNumRange, maxFitOrganism } from '../models/utils';

const fitnessFrequencyMap = (organisms, maxFitness) => {
  const freq = {};
  genNumRange(maxFitness).forEach((f) => { freq[f] = 1; });
  organisms.forEach((o) => { freq[o.fitness] += 1; });
  return Object.entries(freq).map(([key, value]) => ({ fitness: key, frequency: value - 1 }));
};

function GenerationSummaryChart({
  width,
  height,
  margin,
  organisms,
  maxFitness,
}) {
  if (width < 10) return null;

  const theme = useTheme();
  // chart bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const yMax = height - margin.top;
  const yMin = 5;
  const xMax = width;

  const xScale = useMemo(
    () => scaleBand({
      range: [margin.left, innerWidth + margin.left],
      domain: genNumRange(maxFitness),
      round: true,
      padding: 0,
    }),
    [innerWidth, margin.left, maxFitness],
  );

  const xScaleLinear = useMemo(
    () => scaleLinear({
      range: [margin.left, innerWidth + margin.left],
      domain: [0, maxFitness],
    }),
    [innerWidth, margin.left, maxFitness],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [innerHeight - yMin, margin.bottom],
      domain: [0, organisms.length],
      nice: true,
    }),
    [margin.top, innerHeight, organisms.length],
  );

  const data = fitnessFrequencyMap(organisms, maxFitness);
  const meanFitness = mean(organisms, (o) => o.fitness);
  const fitnessDeviation = deviation(organisms, (o) => o.fitness);

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          fill={theme.palette.grey['100']}
        />
        <GradientOrangeRed id="area-gradient" />
        <LinearGradient
          from={theme.palette.secondary.light}
          to={theme.palette.secondary.dark}
          id="background-gradient"
        />
        {/* <GridColumns
          top={margin.top}
          scale={yScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={theme.palette.secondary.dark}
          strokeOpacity={0.2}
          pointerEvents="none"
        /> */}
        {data.map(({ fitness, frequency }) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(frequency);

          return (
            <Bar
              key={fitness}
              x={xScale(fitness)}
              y={yMax - barHeight}
              width={barWidth}
              height={barHeight}
              fill="url(#background-gradient)"
            />
          );
        })}
        <Line
          from={{ x: xScaleLinear(meanFitness), y: margin.top }}
          to={{ x: xScaleLinear(meanFitness), y: innerHeight + margin.top }}
          stroke={theme.palette.secondary.dark}
          strokeWidth={1}
          pointerEvents="none"
          strokeDasharray="5,2"
        />
        <Line
          from={{ x: xScaleLinear(meanFitness + fitnessDeviation), y: margin.top }}
          to={{ x: xScaleLinear(meanFitness + fitnessDeviation), y: innerHeight + margin.top }}
          stroke={theme.palette.secondary.dark}
          strokeWidth={0.5}
          pointerEvents="none"
          strokeDasharray="5,2"
        />
        <Line
          from={{ x: xScaleLinear(meanFitness - fitnessDeviation), y: margin.top }}
          to={{ x: xScaleLinear(meanFitness - fitnessDeviation), y: innerHeight + margin.top }}
          stroke={theme.palette.secondary.dark}
          strokeWidth={0.5}
          pointerEvents="none"
          strokeDasharray="5,2"
        />
      </svg>
    </div>
  );
}

GenerationSummaryChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
  maxFitness: PropTypes.number.isRequired,
};

GenerationSummaryChart.defaultProps = {
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
};

export default withTooltip(GenerationSummaryChart);
