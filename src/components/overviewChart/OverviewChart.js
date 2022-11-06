import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Line, Bar } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { withTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { useTheme } from '@emotion/react';
import OverviewBrush from './OverviewBrush';
import OverviewTooltip from './OverviewTooltip';
import TooltipCircle from './TooltipCircle';
import { useIsComplete } from '../../hooks';
import { GenerationNodeType } from '../../types';
import LineArea from './LineArea';

const chartSeparation = 5;

function OverviewChart({
  margin,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop,
  tooltipLeft,
  targetFitness,
  tree,
  parentRef,
}) {
  const width = parentRef?.clientWidth || 0;
  const height = parentRef?.clientHeight || 0;
  const isComplete = useIsComplete();

  const theme = useTheme();
  const [filteredData, setFilteredData] = useState(tree);
  const currentData = isComplete ? filteredData : tree;

  useEffect(() => {
    if (isComplete) {
      setFilteredData(tree);
    }
  }, [isComplete]);
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
      domain: [0, currentData.length - 1],
    }),
    [currentData, innerWidth],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [topChartHeight, 0],
      domain: [0, targetFitness],
      nice: true,
    }),
    [topChartHeight],
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

  if (!parentRef || width < 10) return null;

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
        <LineArea
          data={currentData.map((gen, i) => ({ x: i, y: gen.maxFitness }))}
          xScale={xScale}
          yScale={yScale}
        />
        <LineArea
          data={currentData.map((gen, i) => ({ x: i, y: gen.meanFitness }))}
          xScale={xScale}
          yScale={yScale}
        />
        <LineArea
          data={currentData.map((gen, i) => ({ x: i, y: gen.minFitness }))}
          xScale={xScale}
          yScale={yScale}
        />
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
            stroke={theme.palette.grey[500]}
            strokeWidth={2}
            pointerEvents="none"
            strokeDasharray="5,2"
            opacity={0.7}
          />
          <TooltipCircle cx={tooltipLeft} cy={yScale(tooltipData.maxFitness)} />
          <TooltipCircle cx={tooltipLeft} cy={yScale(tooltipData.meanFitness)} />
          <TooltipCircle cx={tooltipLeft} cy={yScale(tooltipData.minFitness)} />
        </g>
        )}
        {isComplete && (
          <OverviewBrush
            data={tree}
            margin={brushMargin}
            width={width}
            height={height}
            maxFitness={targetFitness}
            setFilteredData={setFilteredData}
          />
        )}
      </svg>
      {tooltipData && (
      <div>
        <OverviewTooltip
          top={tooltipTop}
          left={tooltipLeft}
          data={tooltipData}
        />
      </div>
      )}
    </>
  );
}

OverviewChart.propTypes = {
  margin: PropTypes.objectOf(PropTypes.number),
  targetFitness: PropTypes.number.isRequired,
  tree: PropTypes.arrayOf(PropTypes.shape(GenerationNodeType)),
  parentRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLInputElement),
    clientWidth: PropTypes.number,
    clientHeight: PropTypes.number,
  }),
  tooltipData: PropTypes.shape(GenerationNodeType),
  tooltipTop: PropTypes.number,
  tooltipLeft: PropTypes.number,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
};

OverviewChart.defaultProps = {
  parentRef: null,
  tree: [],
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  tooltipData: null,
  tooltipLeft: 0,
  tooltipTop: 0,
};

export default withTooltip(OverviewChart);
