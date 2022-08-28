import React from 'react';
import PropTypes from 'prop-types';
import Organism from '../models/organism';
import { maxFitOrganism } from '../models/utils';

function GenerationSummary({ organisms }) {
  const topOrganism = maxFitOrganism(organisms);
  return (
    <div>
      {topOrganism?.ToString()}
    </div>
  );
}

GenerationSummary.propTypes = {
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
};

export default GenerationSummary;
