import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Box } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { Grid } from '@visx/grid';
import ParameterSlider from './ParameterSlider';
import { setMutationRate } from '../../features/parameters/parametersSlice';
import NormalDistribution from '../../globals/normalDistribution';
import { mutationBounds } from '../../constants';

const createData = (mean, sigma) => {
  const dist = new NormalDistribution(mean, sigma);
  const step = 2 / 1e3;
  const result = [];
  let max = 0;
  const domain = sigma * 5;
  for (let i = -domain; i <= domain; i += step) {
    result.push({ x: i, y: dist.f(i) });
    max = Math.max(max, dist.f(i));
  }
  return { dist: result, max };
};

const graphWidth = 190;
const graphHeight = 130;
const margin = {
  left: 20,
  top: 2,
  right: 6,
  bottom: 15,
};

function MutationSlider() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const value = useSelector((state) => state.parameters.mutationRate);
  const { min, max, step } = mutationBounds;
  const { max: dataMax, dist } = createData(0, value);
  const [data, setData] = useState(dist);
  const [maxValue, setMaxValue] = useState(dataMax);

  const setValue = (v) => {
    dispatch(setMutationRate(v));
    // eslint-disable-next-line no-shadow
    const { max, dist } = createData(0, v);
    setData(dist);
    setMaxValue(max);
  };

  const fullWidth = graphWidth + margin.left + margin.right;
  const fullHeight = graphHeight + margin.top + margin.bottom;

  const xScale = useMemo(() => scaleLinear({
    range: [0, graphWidth],
    domain: [-(value * 5), value * 5],
  }), [value]);

  const yScale = useMemo(() => scaleLinear({
    range: [graphHeight, 0],
    domain: [0, maxValue],
  }), [maxValue]);

  const bgColor = theme.palette.background.default;
  const axisColor = theme.palette.grey[400];

  return (
    <Box pb={4}>
      <Box sx={{ borderRadius: `${theme.shape.borderRadius}px`, overflow: 'hidden' }}>
        <svg width={fullWidth} height={fullHeight}>
          <Group top={margin.top} left={margin.left}>
            <rect
              x={0}
              y={0}
              width={graphWidth}
              height={graphHeight}
              fill={bgColor}
              rx={theme.shape.borderRadius}
            />
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={graphWidth}
              height={graphHeight}
              stroke="white"
              strokeOpacity={0.10}
            />
            <LinePath
              data={data}
              x={(entry) => xScale(entry.x)}
              y={(entry) => yScale(entry.y)}
              curve={curveMonotoneX}
              stroke={theme.palette.primary.light}
              strokeWidth={1}
            />
            <AreaClosed
              data={data}
              x={(entry) => xScale(entry.x)}
              y={(entry) => yScale(entry.y)}
              curve={curveMonotoneX}
              yScale={yScale}
              fillOpacity={0.1}
              fill={theme.palette.primary.light}
            />
          </Group>
          <AxisLeft
            scale={yScale}
            top={margin.top}
            left={margin.left}
            tickValues={yScale.ticks(6)}
            tickStroke={axisColor}
            tickLength={4}
            hideAxisLine
            tickLabelProps={() => ({
              fill: axisColor,
              fontSize: 9,
              textAnchor: 'end',
              dx: -1,
              dy: 3,
            })}
          />
          <AxisBottom
            scale={xScale}
            top={fullHeight - margin.bottom}
            left={margin.left}
            tickValues={xScale.ticks(5)}
            tickStroke={axisColor}
            tickLength={4}
            hideAxisLine
            tickLabelProps={() => ({
              fill: axisColor,
              fontSize: 9,
              textAnchor: 'middle',
            })}
          />
        </svg>
      </Box>
      <ParameterSlider
        value={value}
        setValue={setValue}
        formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        Icon={ScienceIcon}
        tooltip="Sigma value for the Mutation rate (follows a Normal Distribution)"
        min={min}
        max={max}
        step={step}
      />
    </Box>
  );
}

export default MutationSlider;
