/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { useTheme } from '@emotion/react';
import { Tooltip, withTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { OrganismNodeType } from '../constants';
import OrganismTreeLink from './OrganismTreeLink';
import { genNodePropsAreEqual, xyToNodeIndex } from '../models/utils';
import OrganismTreeNode from './OrganismTreeNode';

function GenerationLinks({
  id,
  width,
  height,
  nodes,
  isNewestGeneration,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft,
  tooltipTop,
}) {
  const theme = useTheme();
  const background = isNewestGeneration ? theme.palette.grey[900] : 'transparent';
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

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{ background, position: 'relative' }}
        onMouseMove={handleTooltip}
        onMouseLeave={() => hideTooltip()}
      >
        {nodes.map((node, index) => (
          <Group key={`${id}-node-group-${node.id}`}>
            {node.children?.map((child) => (
              <OrganismTreeLink
                key={`node-link-${node.id}-to-${child.id}-${child.index}`}
                source={node}
                target={child}
              />
            ))}
            <OrganismTreeNode
              index={index}
              organism={node}
              isSelected={selectedNodeIndex === index}
            />
          </Group>
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

GenerationLinks.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)).isRequired,
  isNewestGeneration: PropTypes.bool,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  tooltipData: PropTypes.instanceOf(OrganismTreeNode),
  tooltipLeft: PropTypes.number,
  tooltipTop: PropTypes.number,
};

GenerationLinks.defaultProps = {
  isNewestGeneration: false,
  tooltipData: null,
  tooltipLeft: 0,
  tooltipTop: 0,
};

export default memo(withTooltip(GenerationLinks), genNodePropsAreEqual);
