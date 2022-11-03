/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
import React, {
  memo, useCallback, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Tooltip, withTooltip } from '@visx/tooltip';
import { scaleBand } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { localPoint } from '@visx/event';
import { OrganismNodeType, treeParameters } from '../constants';
import OrganismTreeNode from './OrganismTreeNode';
import { genNodePropsAreEqual } from '../models/utils';

// const fitnessFrequencyMap = (organisms, maxFitness) => {
//   const freq = {};
//   genNumRange(maxFitness).forEach((f) => { freq[f] = 1; });
//   organisms.forEach((o) => { freq[o.fitness] += 1; });
//   return Object.entries(freq).map(([key, value]) => ({ fitness: key, frequency: value - 1 }));
// };

const {
  columns,
  rows,
  padding,
  spacing,
} = treeParameters;

const xyToNodeIndex = (x, y, length) => {
  const yInv = (Math.max(y - padding, 0) / spacing);
  const xInv = (Math.max(x - padding, 0)) / spacing;
  const index = rows * Math.round(yInv) + Math.round(xInv);

  return (index < length) ? index : -1;
};

function GenerationNodes({
  width,
  height,
  margin,
  nodes,
  maxFitness,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft,
  tooltipTop,
}) {
  if (width < 10) return null;

  const theme = useTheme();
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(-1);
  const handleTooltip = useCallback(
    (event) => {
      const { x, y } = localPoint(event) || { x: 0, y: 0 };
      const index = xyToNodeIndex(x, y, nodes.length);
      const organism = index < 0 ? null : nodes[index].organism;
      setSelectedNodeIndex(index);

      showTooltip({
        tooltipData: organism,
        tooltipLeft: x,
        tooltipTop: y,
      });
    },
    [showTooltip, setSelectedNodeIndex],
  );
  // chart bounds
  // const innerWidth = width - margin.left - margin.right;
  // const innerHeight = height - margin.top - margin.bottom;
  // const yMax = height - margin.top;
  // const yMin = 5;

  // const xScale = useMemo(
  //   () => scaleBand({
  //     range: [margin.left, innerWidth + margin.left],
  //     domain: genNumRange(maxFitness),
  //     round: true,
  //     padding: 0,
  //   }),
  //   [innerWidth, margin.left, maxFitness],
  // );

  // const xScaleLinear = useMemo(
  //   () => scaleLinear({
  //     range: [margin.left, innerWidth + margin.left],
  //     domain: [0, maxFitness],
  //   }),
  //   [innerWidth, margin.left, maxFitness],
  // );

  // const yScale = useMemo(
  //   () => scaleLinear({
  //     range: [innerHeight - yMin, margin.bottom],
  //     domain: [0, organisms.length],
  //     nice: true,
  //   }),
  //   [margin.top, innerHeight, organisms.length],
  // );

  // const nodes = organismsToNodes(organisms); // fitnessFrequencyMap(organisms, maxFitness);
  return (
    <>
      <svg
        width={width}
        height={height}
        onMouseMove={handleTooltip}
        onMouseLeave={() => hideTooltip()}
        style={{ zIndex: 99 }}
      >
        {nodes.map((n, i) => (
          <OrganismTreeNode
            key={n.id}
            index={i}
            organism={n}
            isSelected={selectedNodeIndex === i}
          />
        ))}
      </svg>
      {tooltipData && (
        <Tooltip left={tooltipLeft} top={tooltipTop}>
          <div>{tooltipData.genome}</div>
          <div>{tooltipData.fitness}</div>
        </Tooltip>
      )}
    </>
  );
}

GenerationNodes.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.objectOf(PropTypes.number),
  nodes: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)).isRequired,
  maxFitness: PropTypes.number.isRequired,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  tooltipData: PropTypes.instanceOf(OrganismTreeNode),
  tooltipLeft: PropTypes.number,
  tooltipTop: PropTypes.number,
};

GenerationNodes.defaultProps = {
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  tooltipData: null,
  tooltipLeft: 0,
  tooltipTop: 0,
};

export default memo(withTooltip(GenerationNodes), genNodePropsAreEqual);
