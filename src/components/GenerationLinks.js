/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@visx/group';
import { OrganismNodeType } from '../constants';
import OrganismTreeLink from './OrganismTreeLink';
import { genNodePropsAreEqual } from '../models/utils';
import OrganismTreeNode from './OrganismTreeNode';

function GenerationLinks({
  id,
  width,
  height,
  // top,
  nodes,
}) {
  return (
    <svg
      width={width}
      height={height}
      style={{
        // top,
        // position: 'absolute',
        // background: 'rgba(0, 0, 255, 0.3)',
      }}
    >
      {nodes.map((node, index) => (
        <Group key={`${id}-node-links-${node.id}`}>
          {node.children?.map((child) => (
            <OrganismTreeLink
              source={node}
              target={child}
            />
          ))}
          <OrganismTreeNode
            index={index}
            organism={node}
          />
        </Group>
      ))}
    </svg>
  );
}

GenerationLinks.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  // top: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)).isRequired,
};

export default memo(GenerationLinks, genNodePropsAreEqual);
