import React from 'react';
import PropTypes from 'prop-types';
import { OrganismNodeType } from '../constants';
import OrganismTreeLink from './OrganismTreeLink';

function GenerationLinks({
  width,
  height,
  top,
  nodes,
}) {
  return (
    <svg
      width={width}
      height={height}
      style={{
        top,
        position: 'absolute',
        // background: 'rgba(0, 0, 255, 0.3)',
      }}
    >
      {nodes.map((node) => {
        if (!node.parentA && !node.parentB) return null;

        return (
          <>
            {node.parentA && (
              <OrganismTreeLink
                key={`${node.parentA.id}-${node.id}-a`}
                source={node.parentA}
                target={node}
              />
            )}
            {node.parentB && (
              <OrganismTreeLink
                key={`${node.parentB.id}-${node.id}-b`}
                source={node.parentB}
                target={node}
              />
            )}
          </>
        );
      })}
    </svg>
  );
}

GenerationLinks.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)).isRequired,
};

export default GenerationLinks;
