import React from 'react';
import PropTypes from 'prop-types';
import { DefaultNode } from '@visx/network';
import { hsvtoHex } from '../models/utils';
import { OrganismNodeType } from '../constants';

function OrganismTreeNode({
  cx, cy, r, organism, isSelected,
}) {
  const saturation = organism.fitness / 5.0;
  const fill = hsvtoHex(150, saturation, 0.9);
  return (
    <DefaultNode
      r={r}
      fill={fill}
      cx={cx}
      cy={cy}
      strokeWidth={isSelected ? 2 : 0}
      stroke="black"
    />
  );
}

OrganismTreeNode.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  r: PropTypes.number,
  organism: PropTypes.shape(OrganismNodeType).isRequired,
  isSelected: PropTypes.bool,
};

OrganismTreeNode.defaultProps = {
  r: 6,
  isSelected: false,
};

export default OrganismTreeNode;
