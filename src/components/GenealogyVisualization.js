import React from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { pick } from 'lodash';
import { GenerationType, treeParameters } from '../constants';
import GenerationLinks from './GenerationLinks';

const {
  columns,
  padding,
  spacing,
} = treeParameters;
const genHeight = 200;

const indexToX = (gen, index) => (index % columns) * spacing + padding;
const indexToY = (gen, index) => Math.trunc(index / columns) * spacing + padding;

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
    const nextGen = gen.organisms.map((organism, index) => ({
      ...organism,
      x: indexToX(genIndex, index),
      y: indexToY(genIndex, index),
      parentA: organismById(organism.parentA, prevGen),
      parentB: organismById(organism.parentB, prevGen),
      children: organism.children.map((id) => ({
        ...organismById(id, generations[genIndex + 1].organisms),
        x: indexToX(id, organismIndex(id, generations[genIndex + 1].organisms)),
        y: indexToY(id, organismIndex(id, generations[genIndex + 1].organisms)),
      })),
    }));

    // prevGen = prevGen.map((organism) => ({
    //   ...organism,
    //   children: organism.children.map((id) => (organismById(id, nextGen))),
    // }));

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
      {tree.map((gen, index) => (
        index === tree.length - 1 ? null
          : (
            <Box
              sx={{ position: 'relative' }}
              key={gen.id}
            >
              <GenerationLinks
                id={gen.id}
                nodes={gen.nodes}
                maxFitness={maxFitness}
                width={350}
                height={genHeight}
                top={-genHeight - padding / 2}
              />
            </Box>
          )
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
