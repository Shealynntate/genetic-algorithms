import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from '@visx/scale';
import { maxBy } from 'lodash';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { useTheme } from '@emotion/react';
import StatsLine from '../StatsLine';
import { getCurrentStats } from '../../globals/database';

const margin = {
  top: 20,
  bottom: 20,
  left: 10,
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

const averageBestUpdateData = (data, interval) => {
  let count = 0;
  const results = [];
  data.forEach((entry) => {
    count += entry.isGlobalBest ? 1 : 0;
    if (entry.genId % interval === 0) {
      results.push({ x: entry.genId, y: entry.genId / count });
    }
  });
  return results;
};

function StatsPanel({ width, height }) {
  const [stats, setStats] = useState([]);
  const theme = useTheme();
  // const bgColor = theme.palette.background.default;
  const axisColor = theme.palette.grey[400];

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getCurrentStats();
      setStats(result);
    };
    fetchStats();
  }, []);

  const data = stats.map((entry) => ({ x: entry.genId, y: entry.maxFitness }));
  // eslint-disable-next-line no-unused-vars
  const bestData = genBestUpdateData(stats);
  const averageGBUpdateData = averageBestUpdateData(stats, 20);
  // const minY = stats.length ? stats[0].maxFitness : 0;
  const minY = 1;
  // const maxY = bestData.length ? maxBy(bestData, (d) => d.y).y : 0;
  const maxY = averageGBUpdateData.length ? maxBy(averageGBUpdateData, (d) => d.y).y : 0;

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
      {/* <StatsLine data={bestData} xScale={xScale} yScale={yScale} /> */}
      <StatsLine data={averageGBUpdateData} xScale={xScale} yScale={yScale} />
      <AxisLeft
        scale={yScale}
        top={margin.top}
        left={margin.left}
        tickValues={yScale.domain()}
        tickStroke={axisColor}
        tickLength={4}
        // hideAxisLine
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
        top={height - margin.bottom}
        left={margin.left}
        tickValues={xScale.ticks()}
        tickStroke={axisColor}
        tickLength={4}
        // hideAxisLine
        tickLabelProps={() => ({
          fill: axisColor,
          fontSize: 9,
          textAnchor: 'middle',
        })}
      />
    </svg>
  );
}

StatsPanel.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

StatsPanel.defaultProps = {
  width: 0,
  height: 0,
};

export default StatsPanel;
