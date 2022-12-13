import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import StatsLine from './StatsLine';

const margin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

function StatsPanel({ width, height }) {
  const stats = useSelector((state) => state.metadata.genStats);
  const globalBest = useSelector((state) => state.metadata.globalBest);
  const data = stats.map((entry) => ({ x: entry.genId, y: entry.maxFitness }));

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
      domain: [stats[0].maxFitness, globalBest.organism.fitness],
    }),
    [globalBest.organism.fitness, stats, height],
  );

  return (
    <svg width={width} height={height}>
      <StatsLine data={data} xScale={xScale} yScale={yScale} />
    </svg>
  );
}

StatsPanel.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default StatsPanel;
