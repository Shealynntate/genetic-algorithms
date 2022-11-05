import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { Box, Paper } from '@mui/material';
import { pick } from 'lodash';
import { GenerationType, treeParameters } from '../constants';
import GenerationLinks from './GenerationLinks';
import { nodeIndexToX, nodeIndexToY } from '../models/utils';

const { genHeight, padding } = treeParameters;

const organismIndex = (id, organisms) => (organisms.findIndex((o) => o.id === id));

const organismById = (id, organisms) => {
  const organism = organisms?.find((o) => o.id === id);
  if (!organism) return null;
  // Only return the parent's position to avoid overhead of recursive parent pointers
  return pick(organism, ['x', 'y', 'id', 'genome', 'fitness']);
};

const generateTree = (generations) => {
  let prevGen = [];
  return generations.map((gen, genIndex) => {
    const nextGen = generations[genIndex + 1]?.organisms || [];
    const currentGen = gen.organisms.map((organism, index) => ({
      ...organism,
      x: nodeIndexToX(index),
      y: nodeIndexToY(index),
      parentA: organismById(organism.parentA, prevGen),
      parentB: organismById(organism.parentB, prevGen),
      children: organism.children.map((id, childIndex) => ({
        ...organismById(id, nextGen),
        x: nodeIndexToX(organismIndex(id, nextGen)),
        y: nodeIndexToY(organismIndex(id, nextGen)) + genHeight,
        index: childIndex,
      })),
    }));

    prevGen = currentGen;
    return {
      id: gen.id,
      meanFitness: gen.meanFitness,
      deviation: gen.deviation,
      nodes: currentGen,
    };
  });
};

function GenealogyVisualization({
  generations,
  maxFitness,
}) {
  // const theme = useTheme();
  const latestGenRef = useRef();
  if (latestGenRef.current) {
    latestGenRef.current.scrollIntoView(false, { behavior: 'smooth' });
  }

  const tree = generateTree(generations);
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
          <GenerationLinks
            id={gen.id}
            nodes={gen.nodes}
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
  generations: PropTypes.arrayOf(PropTypes.shape(GenerationType)),
  maxFitness: PropTypes.number.isRequired,
};

GenealogyVisualization.defaultProps = {
  generations: [],
};

export default GenealogyVisualization;
