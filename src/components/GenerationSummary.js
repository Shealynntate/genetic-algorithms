/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withTooltip } from '@visx/tooltip';
import { AreaClosed } from '@visx/shape';
import { GradientOrangeRed, LinearGradient } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { curveMonotoneX } from '@visx/curve';
import { useTheme } from '@emotion/react';
import Organism from '../models/organism';
import { maxFitOrganism } from '../models/utils';

function GenerationSummary({
  width,
  height,
  margin,
  organisms,
}) {
  const theme = useTheme();
  if (width < 10) return null;

  // chart bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const topOrganism = maxFitOrganism(organisms);

  const xScale = useMemo(
    () => scaleLinear({
      range: [margin.left, innerWidth + margin.left],
      domain: [0, organisms.length],
    }),
    [innerWidth, margin.left, organisms.length],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [innerHeight + margin.top, margin.top],
      domain: [0, topOrganism.fitness],
      nice: true,
    }),
    [margin.top, innerHeight, topOrganism],
  );

  const data = organisms.map((o, i) => ({ x: i, y: o.fitness }));

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={14}
          fill="url(#background-gradient)"
        />
        <GradientOrangeRed id="area-gradient" fromOpacity={1} toOpacity={1} />
        <LinearGradient
          from={theme.palette.secondary.light}
          to={theme.palette.secondary.dark}
          id="background-gradient"
        />
        <AreaClosed
          data={data}
          x={(d) => xScale(d.x)}
          y={(d) => yScale(d.y)}
          yScale={yScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
      </svg>
      {/* {topOrganism?.ToString()} */}
    </div>
  );
}

GenerationSummary.propTypes = {
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
};

GenerationSummary.defaultProps = {
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
};

export default withTooltip(GenerationSummary);
