import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { useTheme } from '@emotion/react';
import { curveMonotoneX } from '@visx/curve';
import { Brush } from '@visx/brush';
import { PatternLines } from '@visx/pattern';
import { scaleLinear } from '@visx/scale';
import { useSelector } from 'react-redux';
import { GridColumns } from '@visx/grid';
import BrushHandle from './BrushHandle';
import { minResultsThreshold } from '../../constants';
import { SimulationType } from '../../types';
import RunningSimulationGraph from '../simulations/RunningSimulationGraph';

const PATTERN_ID = 'brush_pattern';
// const GRADIENT_ID = 'brush_gradient';
const handleSize = 8;
const lineWidth = 8;
const lineHeight = 8;

const selectedBoxStyle = (theme) => ({
  fill: `url(#${PATTERN_ID})`,
  stroke: theme.palette.grey[400],
});

function ChartBrush({
  simulations,
  margin,
  width,
  height,
  maxFitness,
  maxGenerations,
  setDomain,
  showRunningSim,
}) {
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  // Prevent component from calling setDomain multiple times with the same values
  const initialMax = useRef(maxGenerations);
  const domainRef = useRef({ x0: 0, x1: maxGenerations });
  const theme = useTheme();
  const bgColor = theme.palette.background.default;

  useEffect(() => {
    const max = domainRef.current.x1;
    if (initialMax.current === max || max > maxGenerations) {
      // Invoke callback initially in case maxGenerations is different from default max
      domainRef.current.x1 = maxGenerations;
      setDomain(domainRef.current.x0, domainRef.current.x1);
    }
    initialMax.current = maxGenerations;
  }, [maxGenerations]);

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, width],
      domain: [0, maxGenerations],
    }),
    [maxGenerations],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [height, 0],
      domain: [minResultsThreshold, maxFitness],
    }),
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: xScale(0) },
      end: { x: xScale(maxGenerations) },
    }),
    [xScale, maxGenerations],
  );

  const onBrushEnd = (domain) => {
    if (!domain) return;

    let { x0, x1 } = domain;
    x0 = Math.max(0, Math.floor(x0));
    x1 = Math.min(maxGenerations, Math.floor(x1));

    if (domainRef.current.x0 === x0 && domainRef.current.x1 === x1) return;

    domainRef.current = { x0, x1 };
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
      <GridColumns
        scale={xScale}
        width={width}
        height={height}
        stroke="white"
        strokeOpacity={0.10}
      />
      {simulations.map(({ id, results }) => (
        <LinePath
          key={`brush-chart-line-${id}`}
          data={results}
          x={(d) => xScale(d.stats.genId)}
          y={(d) => yScale(d.stats.maxFitness)}
          strokeWidth={1}
          stroke={graphEntries[id]}
          curve={curveMonotoneX}
          shapeRendering="geometricPrecision"
        />
      ))}
      {showRunningSim && (
        <RunningSimulationGraph
          xScale={xScale}
          yScale={yScale}
          showMean={false}
          showMin={false}
          showDeviation={false}
          graphHeight={height}
        />
      )}
      <PatternLines
        id={PATTERN_ID}
        strokeWidth={0.25}
        width={lineWidth}
        height={lineHeight}
        stroke={theme.palette.grey[600]}
        orientation={['diagonal']}
      />
      <Brush
        xScale={xScale}
        yScale={yScale}
        width={width}
        height={height}
        margin={margin}
        initialBrushPosition={initialBrushPosition}
        resizeTriggerAreas={['left', 'right']}
        brushDirection="horizontal"
        onChange={onBrushEnd}
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
  simulations: PropTypes.arrayOf(PropTypes.shape(SimulationType)),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxFitness: PropTypes.number.isRequired,
  maxGenerations: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
  setDomain: PropTypes.func,
  showRunningSim: PropTypes.bool,
};

ChartBrush.defaultProps = {
  simulations: [],
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  setDomain: () => {},
  showRunningSim: false,
};

export default ChartBrush;
