import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { Box, Paper } from '@mui/material';
import { GenerationNodeType } from '../../types';
import { treeParameters } from '../../constants';
import GenerationLayer from './GenerationLayer';

const { genHeight, padding } = treeParameters;

function GenealogyVisualization({
  tree,
  maxFitness,
}) {
  // const theme = useTheme();
  const latestGenRef = useRef();
  if (latestGenRef.current) {
    latestGenRef.current.scrollIntoView(false, { behavior: 'smooth' });
  }

  return (
    <Paper
      sx={{
        maxHeight: 600,
        overflowY: 'scroll',
      }}
      className="no-scrollbar"
    >
      {tree.map((gen, index) => (
        <Box
          sx={{ position: 'relative', lineHeight: 0, height: genHeight - padding }}
          key={gen.id}
          ref={index === tree.length - 1 ? latestGenRef : null}
        >
          <GenerationLayer
            id={gen.id}
            nodes={gen.organisms}
            maxFitness={maxFitness}
            width={350}
            height={genHeight}
            top={-padding}
            isNewestGeneration={index === tree.length - 1}
          />
        </Box>
      ))}
    </Paper>
  );
}

GenealogyVisualization.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape(GenerationNodeType)),
  maxFitness: PropTypes.number.isRequired,
};

GenealogyVisualization.defaultProps = {
  tree: [],
};

export default GenealogyVisualization;
