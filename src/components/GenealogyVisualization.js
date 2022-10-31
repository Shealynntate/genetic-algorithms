import React from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { GenerationNodeType, treeParameters } from '../constants';
import GenerationNodes from './GenerationNodes';
import GenerationLinks from './GenerationLinks';

const {
  columns,
  padding,
  spacing,
} = treeParameters;
const genHeight = 200;

const indexToX = (gen, index) => (index % columns) * spacing + padding;
const indexToY = (gen, index) => Math.trunc(index / columns) * spacing + padding;

const organismById = (id, organisms) => organisms.find((o) => o.id === id);

const generateTree = (generations) => {
  let prevGen = [];
  return generations.map((gen, genIndex) => {
    const nextGen = gen.organisms.map((organism, index) => ({
      ...organism,
      x: indexToX(genIndex, index),
      y: indexToY(genIndex, index),
      parentA: organismById(organism.parentA, prevGen),
      parentB: organismById(organism.parentB, prevGen),
    }));
    prevGen = nextGen;
    return {
      id: gen.id,
      meanFitness: gen.meanFitness,
      deviation: gen.deviation,
      nodes: nextGen,
    };
  });
};

function GenealogyVisualization({
  generations,
  maxFitness,
}) {
  // const theme = useTheme();

  const tree = generateTree(generations);
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
      {tree.map((gen) => (
        <Box
          sx={{ position: 'relative' }}
          key={gen.id}
        >
          <GenerationLinks
            id={gen.id}
            nodes={gen.nodes}
            maxFitness={maxFitness}
            width={200}
            height={genHeight * 2}
            top={-genHeight - padding / 2}
          />
          <GenerationNodes
            id={gen.id}
            nodes={gen.nodes}
            maxFitness={maxFitness}
            width={200}
            height={genHeight}
          />
        </Box>
      ))}
    </>
  );
}

GenealogyVisualization.propTypes = {
  generations: PropTypes.arrayOf(PropTypes.shape(GenerationNodeType)),
  maxFitness: PropTypes.number.isRequired,
};

GenealogyVisualization.defaultProps = {
  generations: [],
};

export default GenealogyVisualization;
