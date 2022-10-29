/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import { Paper, Typography } from '@mui/material';
// import { useTheme } from '@emotion/react';
// import { medianIndex } from 'd3-array';
import { useDispatch, useSelector } from 'react-redux';
import GenerationNodes from './GenerationNodes';
// import { maxFitOrganism } from '../models/utils';
import { setGeneration } from '../features/uxSlice';
import { GenerationNodeType } from '../constants';

const GenerationSummary = memo(({ genNode, maxFitness }) => {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const { organisms, id } = genNode;
  // const topOrganism = maxFitOrganism(organisms);
  // const median = organisms[medianIndex(organisms, (o) => o.fitness)];
  const selectedGeneration = useSelector((state) => state.ux.selectedGeneration);
  const isSelected = selectedGeneration === id;

  return (
    // <Paper
    //   onClick={() => { dispatch(setGeneration(id)); }}
    //   elevation={isSelected ? 5 : 1}
    //   sx={{
    //     margin: theme.spacing(1),
    //     padding: `0 ${theme.spacing(1)}`,
    //   }}
    // >
    // <Typography variant="subtitle1">{`Gen ${id}`}</Typography>
    <ParentSize style={{ height: 250, width: 250 }}>
      {({ width, height }) => (
        <GenerationNodes
          width={width}
          height={height}
          organisms={organisms}
          maxFitness={maxFitness}
        />
      )}
    </ParentSize>
    // {/* <Typography>{`Top: ${topOrganism?.toString()}`}</Typography> */}
    // {/* <Typography>{`Median: ${median?.toString()}`}</Typography> */}
    // </Paper>
  );
});

GenerationSummary.propTypes = {
  genNode: PropTypes.shape(GenerationNodeType).isRequired,
  maxFitness: PropTypes.number.isRequired,
};

export default GenerationSummary;
