import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import GenerationSummaryChart from './GenerationSummaryChart';
import Organism from '../models/organism';
import { maxFitOrganism } from '../models/utils';

function GenerationSummary({ organisms, maxFitness }) {
  const topOrganism = maxFitOrganism(organisms);

  return (
    <div>
      {topOrganism?.ToString()}
      <ParentSize style={{ height: 160, width: 160 }}>
        {({ width, height }) => (
          <GenerationSummaryChart
            width={width}
            height={height}
            organisms={organisms}
            maxFitness={maxFitness}
          />
        )}
      </ParentSize>
    </div>
  );
}

GenerationSummary.propTypes = {
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
  maxFitness: PropTypes.number.isRequired,
};

export default GenerationSummary;
