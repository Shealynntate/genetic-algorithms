import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { AreaClosed, LinePath } from '@visx/shape';
import { useTheme } from '@emotion/react';
import { curveMonotoneX } from '@visx/curve';
import { Brush } from '@visx/brush';
import { PatternLines } from '@visx/pattern';
import { scaleLinear } from '@visx/scale';
import BrushHandle from './BrushHandle';
import { minExperimentThreshold } from '../../constants';

const PATTERN_ID = 'brush_pattern';
// const GRADIENT_ID = 'brush_gradient';
const handleSize = 8;
const lineWidth = 8;
const lineHeight = 8;
const fillOpacity = 0.15;

const selectedBoxStyle = (theme) => ({
  fill: `url(#${PATTERN_ID})`,
  stroke: theme.palette.grey[400],
});

function ChartBrush({
  data,
  margin,
  width,
  height,
  maxFitness,
  maxGenerations,
  setDomain,
}) {
  const theme = useTheme();

  const bgColor = theme.palette.background.default;

  // Determine bounds and scale functions
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, xMax],
      domain: [0, maxGenerations],
    }),
    [xMax, data.length],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [yMax, 0],
      domain: [minExperimentThreshold, maxFitness],
    }),
    [yMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: xScale(0) },
      end: { x: xScale(maxGenerations) },
    }),
    [xScale, data],
  );

  const onBrushEnd = (domain) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    // const dataSubset = data.filter((item) => item.x >= x0 && item.x <= x1);
    setDomain(x0, x1);
  };

  return (
    <Group
      top={margin.top}
      left={margin.left}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={bgColor}
        rx={theme.shape.borderRadius}
      />
      <LinePath
        data={data}
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.y)}
        strokeWidth={1}
        stroke={theme.palette.primary.light}
        curve={curveMonotoneX}
        shapeRendering="geometricPrecision"
      />
      <AreaClosed
        data={data}
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.meanFitness)}
        yScale={yScale}
        fillOpacity={fillOpacity}
        fill={theme.palette.primary.light}
      />
      <PatternLines
        id={PATTERN_ID}
        strokeWidth={0.5}
        width={lineWidth}
        height={lineHeight}
        stroke={theme.palette.primary.light}
        orientation={['diagonal']}
      />
      <Brush
        xScale={xScale}
        yScale={yScale}
        width={xMax}
        height={yMax}
        margin={margin}
        initialBrushPosition={initialBrushPosition}
        resizeTriggerAreas={['left', 'right']}
        brushDirection="horizontal"
        onBrushEnd={onBrushEnd}
        // onClick={() => setDomain(0, maxGenerations)}
        handleSize={handleSize}
        selectedBoxStyle={selectedBoxStyle(theme)}
        useWindowMoveEvents
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderBrushHandle={(props) => <BrushHandle {...props} />}
      />
    </Group>
  );
}

ChartBrush.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxFitness: PropTypes.number.isRequired,
  maxGenerations: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
  setDomain: PropTypes.func,
};

ChartBrush.defaultProps = {
  data: [],
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  setDomain: () => {},
};

export default ChartBrush;
