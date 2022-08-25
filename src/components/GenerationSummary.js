import React from 'react';
import PropTypes from 'prop-types';
import Organism from '../models/organism';

function GenerationSummary({ organisms }) {
  return (
    <div>
      {organisms.map((o) => o.ToString())}
    </div>
  );
}

GenerationSummary.propTypes = {
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
};

export default GenerationSummary;
