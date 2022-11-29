import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Box } from '@mui/material';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import ParameterSlider from './ParameterSlider';
import { maxMutationRate, minMutationRate, mutationRateStep } from '../../constants';
import { setMutationRate } from '../../features/metadata/metadataSlice';
import NormalDistribution from '../../globals/normalDistribution';

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

// const graphWidth = 200;
const graphHeight = 100;

function MutationSlider() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const value = useSelector((state) => state.metadata.mutationRate);
  const { max, dist } = createData(0, value);
  const [data, setData] = useState(dist);
  const [maxValue, setMaxValue] = useState(max);

  const setValue = (v) => {
    dispatch(setMutationRate(v));
    // eslint-disable-next-line no-shadow
    const { max, dist } = createData(0, v);
    setData(dist);
    setMaxValue(max);
  };

  const xScale = useMemo(() => scaleLinear({
    range: [20, 200 - 20],
    domain: [-(value * 5), value * 5],
  }), [value]);

  const yScale = useMemo(() => scaleLinear({
    range: [graphHeight, 0],
    domain: [0, maxValue],
  }), [maxValue]);

  const margin = {
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
  };

  return (
    <Box pb={4}>
      <div>
        <ParentSize>
          {({ width }) => (
            <svg width={width} height={graphHeight + margin.top + margin.bottom}>
              <AxisLeft
                scale={yScale}
                left={margin.left}
                tickValues={yScale.ticks(6)}
              />
              <Group left={margin.left}>
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
                <AxisBottom
                  scale={xScale}
                  top={graphHeight - margin.bottom}
                  tickValues={xScale.ticks(5)}
                />
              </Group>
            </svg>
          )}
        </ParentSize>
      </div>
      <ParameterSlider
        value={value}
        setValue={setValue}
        formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        label="Mutation"
        min={minMutationRate}
        max={maxMutationRate}
        step={mutationRateStep}
      />
    </Box>
  );
}

export default MutationSlider;
