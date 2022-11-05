import React from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { pick, reverse } from 'lodash';
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
        y: nodeIndexToY(organismIndex(id, nextGen)) - genHeight,
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

  const tree = reverse(generateTree(generations));
  return (
    <>
      {/* <svg width="100%" height="500px">
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={theme.shape.borderRadius}
          fill={theme.palette.background.paper}
        />
      </svg> */}
      {tree.map((gen, index) => (
        <Box
          sx={{ position: 'relative', lineHeight: 0, height: genHeight - padding }}
          key={gen.id}
        >
          <GenerationLinks
            id={gen.id}
            nodes={gen.nodes}
            maxFitness={maxFitness}
            width={350}
            height={genHeight}
            top={-padding}
            isNewestGeneration={index === 0}
          />
        </Box>
      ))}
    </>
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
