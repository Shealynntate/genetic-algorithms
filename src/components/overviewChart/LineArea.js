import React from 'react';
import PropTypes from 'prop-types';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { useTheme } from '@emotion/react';

const lineWidth = 1;
const areaOpacity = 0.08;
const circleRadius = 1.5;
const circleOpacity = 0.3;

function LineArea({
  data,
  xScale,
  yScale,
}) {
  const theme = useTheme();

  return (
    <>
      <LinePath
        data={data}
        x={(entry) => xScale(entry.x)}
        y={(entry) => yScale(entry.y)}
        curve={curveMonotoneX}
        shapeRendering="geometricPrecision"
        stroke={theme.palette.primary.light}
        strokeWidth={lineWidth}
      />
      <AreaClosed
        data={data}
        x={(entry) => xScale(entry.x)}
        y={(entry) => yScale(entry.y)}
        yScale={yScale}
        curve={curveMonotoneX}
        fillOpacity={areaOpacity}
        fill={theme.palette.primary.light}
      />
      {data.map(({ x, y }) => (
        <circle
          key={x}
          cx={xScale(x)}
          cy={yScale(y)}
          r={circleRadius}
          stroke={theme.palette.primary.light}
          opacity={circleOpacity}
        />
      ))}
    </>
  );
}

LineArea.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

LineArea.defaultProps = {
  data: [],
};

export default LineArea;
