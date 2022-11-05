import React from 'react';
import PropTypes from 'prop-types';
import { LinkVertical } from '@visx/shape';
import { OrganismNodeType } from '../constants';

function OrganismTreeLink({ source, target }) {
  if (!source || !target) return null;

  return (
    <LinkVertical
      data={{ source, target }}
      fill="none"
      strokeWidth={0.5}
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
