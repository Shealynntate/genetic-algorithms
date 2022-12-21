import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from '@visx/scale';
import { maxBy } from 'lodash';
import StatsLine from '../StatsLine';
import { getCurrentStats } from '../../globals/database';

const margin = {
  top: 20,
  bottom: 20,
  left: 0,
  right: 0,
};

const genBestUpdateData = (data) => {
  let count = 0;
  return data.map((entry) => {
    count = entry.isGlobalBest ? 0 : count + 1;
    return {
      x: entry.genId,
      y: count,
    };
  });
};

function StatsPanel({ width, height }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getCurrentStats();
      setStats(result);
    };
    fetchStats();
  }, []);

  const data = stats.map((entry) => ({ x: entry.genId, y: entry.maxFitness }));
  const bestData = genBestUpdateData(stats);
  const minY = stats.length ? stats[0].maxFitness : 0;
  const maxY = bestData.length ? maxBy(bestData, (d) => d.y).y : 0;

  const xScale = useMemo(
    () => scaleLinear({
      range: [margin.left, width - margin.left],
      domain: [0, data.length],
    }),
    [data, width],
  );

  const yScale = useMemo(
    () => scaleLinear({
      range: [height - margin.top - margin.bottom, margin.bottom],
      domain: [minY, maxY],
    }),
    [minY, maxY, height],
  );

  if (!stats.length) return null;

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
