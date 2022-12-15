import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { maxBy } from 'lodash';
import StatsLine from './StatsLine';

const margin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const genBestUpdateData = (data) => {
  let count = 0;
  return data.map((entry) => {
    count = entry.isBest ? 0 : count + 1;
    return {
      x: entry.genId,
      y: count,
    };
  });
};

function StatsPanel({ width, height }) {
  const stats = useSelector((state) => state.metadata.genStats);
  // const globalBest = useSelector((state) => state.metadata.globalBest);
  const data = stats.map((entry) => ({ x: entry.genId, y: entry.maxFitness }));
  const bestData = genBestUpdateData(stats);

  const xScale = useMemo(
    () => scaleLinear({
      range: [margin.left, width - margin.left],
      domain: [0, data.length],
    }),
    [data, width],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [height - margin.top, margin.bottom],
      domain: [stats[0].maxFitness, maxBy(bestData, (d) => d.y).y],
    }),
    [bestData, stats, height],
  );

  return (
    <svg width={width} height={height}>
      {/* <StatsLine data={data} xScale={xScale} yScale={yScale} /> */}
      <StatsLine data={bestData} xScale={xScale} yScale={yScale} />
    </svg>
  );
}

StatsPanel.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default StatsPanel;
