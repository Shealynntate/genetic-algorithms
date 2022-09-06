import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import { Paper, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { medianIndex } from 'd3-array';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneration } from '../features/generationSlice';
import GenerationSummaryChart from './GenerationSummaryChart';
import Organism from '../models/organism';
import { maxFitOrganism } from '../models/utils';

function GenerationSummary({ genNumber, organisms, maxFitness }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const topOrganism = maxFitOrganism(organisms);
  const median = organisms[medianIndex(organisms, (o) => o.fitness)];
  const selectedGeneration = useSelector((state) => state.generation.value);
  const isSelected = selectedGeneration === organisms;

  return (
    <Paper
      onClick={() => { dispatch(setGeneration(organisms)); }}
      elevation={isSelected ? 2 : 1}
      sx={{
        margin: theme.spacing(1),
        padding: `0 ${theme.spacing(1)}`,
      }}
    >
      <Typography variant="subtitle1">{`Gen ${genNumber}`}</Typography>
      <ParentSize style={{ height: 100, width: 130 }}>
        {({ width, height }) => (
          <GenerationSummaryChart
            width={width}
            height={height}
            organisms={organisms}
            maxFitness={maxFitness}
          />
        )}
      </ParentSize>
      <Typography>{`Top: ${topOrganism?.ToString()}`}</Typography>
      <Typography>{`Median: ${median?.ToString()}`}</Typography>
    </Paper>
  );
}

GenerationSummary.propTypes = {
  genNumber: PropTypes.number.isRequired,
  organisms: PropTypes.arrayOf(PropTypes.instanceOf(Organism)).isRequired,
  maxFitness: PropTypes.number.isRequired,
};

export default GenerationSummary;
