import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { useTheme } from '@emotion/react';
import { curveMonotoneX } from '@visx/curve';
import { Brush } from '@visx/brush';
import { PatternLines } from '@visx/pattern';
import { scaleLinear } from '@visx/scale';

function BrushHandle({ x, height, isBrushActive }) {
  const theme = useTheme();
  const pathWidth = 8;
  const pathHeight = 15;

  if (!isBrushActive) {
    return null;
  }

  return (
    <Group top={(height - pathHeight) / 2} left={x + pathWidth / 2}>
      <path
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        fill={theme.palette.grey['100']}
        strokeWidth="1"
        stroke={theme.palette.grey['400']}
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

BrushHandle.propTypes = {
  x: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isBrushActive: PropTypes.bool.isRequired,
};

function PopulationOverviewBrush({
  data,
  margin,
  width,
  height,
  maxFitness,
  setFilteredData,
}) {
  const theme = useTheme();
  const brushRef = useRef();

  // Determine bounds and scale functions
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const handleSize = 8;
  const initialLeftBound = 12;
  const initialRightBound = 1;
  const PATTERN_ID = 'brush_pattern';
  const lineWidth = 8;
  const lineHeight = 8;

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, xMax],
      domain: [0, data.length - 1],
    }),
    [xMax, data.length],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [yMax, 0],
      domain: [0, maxFitness],
    }),
    [yMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: xScale(Math.max(data.length - initialLeftBound, 0)) },
      end: { x: xScale(Math.max(data.length - initialRightBound, 0)) },
    }),
    [xScale],
  );

  const onBrushChange = (domain) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    const dataSubset = data.filter((item) => item.x >= x0 && item.x <= x1);
    setFilteredData(dataSubset);
  };

  return (
    <Group
      top={margin.top}
      left={margin.left}
    >
      <LinePath
        data={data}
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.mean)}
        strokeWidth={1}
        stroke={theme.palette.primary.light}
        curve={curveMonotoneX}
        shapeRendering="geometricPrecision"
      />
      <PatternLines
        id={PATTERN_ID}
        strokeWidth={1}
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
        innerRef={brushRef}
        initialBrushPosition={initialBrushPosition}
        onChange={onBrushChange}
        resizeTriggerAreas={['left', 'right']}
        brushDirection="horizontal"
        handleSize={handleSize}
        useWindowMoveEvents
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderBrushHandle={(props) => <BrushHandle {...props} />}
      />
    </Group>
  );
}

PopulationOverviewBrush.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxFitness: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
  setFilteredData: PropTypes.func,
};

PopulationOverviewBrush.defaultProps = {
  data: [],
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  setFilteredData: () => {},
};

export default PopulationOverviewBrush;
