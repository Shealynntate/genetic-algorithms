import React from 'react';
import PropTypes from 'prop-types';
import { OrganismNodeType } from '../constants';

function OrganismTreeLink({ source, target }) {
  if (!source || !target) return null;

  return (
    <line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y + 200}
      strokeWidth={1}
      stroke="grey"
    />
  );
}

OrganismTreeLink.propTypes = {
  source: PropTypes.shape(OrganismNodeType),
  target: PropTypes.shape(OrganismNodeType),
};

OrganismTreeLink.defaultProps = {
  source: null,
  target: null,
};

export default OrganismTreeLink;
