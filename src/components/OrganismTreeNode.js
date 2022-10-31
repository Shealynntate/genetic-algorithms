import React from 'react';
import PropTypes from 'prop-types';
import { DefaultNode } from '@visx/network';
import { hsvtoHex } from '../models/utils';
import { OrganismNodeType, treeParameters } from '../constants';

const {
  columns,
  padding,
  spacing,
} = treeParameters;

const indexToX = (index) => (index % columns) * spacing + padding;
const indexToY = (index) => Math.trunc(index / columns) * spacing + padding;

function OrganismTreeNode({
  index, r, organism, isSelected,
}) {
  const saturation = organism.fitness / 5.0;
  const fill = hsvtoHex(150, saturation, 0.9);
  return (
    <DefaultNode
      r={r}
      fill={fill}
      cx={indexToX(index)}
      cy={indexToY(index)}
      strokeWidth={isSelected ? 2 : 0}
      stroke="black"
    />
  );
}

OrganismTreeNode.propTypes = {
  index: PropTypes.number.isRequired,
  r: PropTypes.number,
  organism: PropTypes.shape(OrganismNodeType).isRequired,
  isSelected: PropTypes.bool,
};

OrganismTreeNode.defaultProps = {
  r: treeParameters.radius,
  isSelected: false,
};

export default OrganismTreeNode;
