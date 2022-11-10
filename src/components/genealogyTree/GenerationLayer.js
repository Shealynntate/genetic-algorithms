import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { useTheme } from '@emotion/react';
import { Tooltip, withTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Typography } from '@mui/material';
import { OrganismNodeType } from '../../types';
import { treeParameters } from '../../constants';
import { genNodePropsAreEqual, xyToNodeIndex } from '../../models/utils';
import OrganismTreeLink from './OrganismTreeLink';
import OrganismTreeNode from './OrganismTreeNode';

const {
  padding,
  radius,
} = treeParameters;

const nodeThresholdY = padding + (radius * 2) + 10;

function GenerationLayer({
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
      if (y > nodeThresholdY) {
        setSelectedNodeIndex(-1);
        return;
      }
      const index = xyToNodeIndex(x, y, nodes.length);
      const organism = index < 0 ? null : nodes[index];
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
        onMouseEnter={handleTooltip}
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
        <Tooltip left={tooltipLeft} top={tooltipTop} className="see-through">
          {/* <Typography>{`Genome: ${tooltipData.genome}`}</Typography> */}
          <Typography>{`Fitness: ${tooltipData.fitness}`}</Typography>
          <Typography>{`Offspring: ${tooltipData.children.length}`}</Typography>
        </Tooltip>
      )}
    </>
  );
}

GenerationLayer.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)).isRequired,
  isNewestGeneration: PropTypes.bool,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  tooltipData: PropTypes.shape(OrganismNodeType),
  tooltipLeft: PropTypes.number,
  tooltipTop: PropTypes.number,
};

GenerationLayer.defaultProps = {
  isNewestGeneration: false,
  tooltipData: null,
  tooltipLeft: 0,
  tooltipTop: 0,
};

export default memo(withTooltip(GenerationLayer), genNodePropsAreEqual);
