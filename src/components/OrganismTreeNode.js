import React from 'react';
import PropTypes from 'prop-types';
import { DefaultNode } from '@visx/network';
import { hsvtoHex } from '../models/utils';
import { OrganismNodeType, treeParameters } from '../constants';

function OrganismTreeNode({
  r, organism, isSelected,
}) {
  const saturation = organism.fitness / 5.0;
  const fill = hsvtoHex(150, saturation, 0.9);

  return (
    <DefaultNode
      r={r}
      fill={fill}
      cx={organism.x}
      cy={organism.y}
      strokeWidth={isSelected ? 2 : 0}
      stroke="blue"
      zindex={2}
    />
  );
}

OrganismTreeNode.propTypes = {
  r: PropTypes.number,
  organism: PropTypes.shape(OrganismNodeType).isRequired,
  isSelected: PropTypes.bool,
};

OrganismTreeNode.defaultProps = {
  r: treeParameters.radius,
  isSelected: false,
};

export default OrganismTreeNode;
