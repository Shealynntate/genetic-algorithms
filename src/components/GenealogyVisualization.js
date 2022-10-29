import React from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '@emotion/react';
import { GenerationNodeType } from '../constants';
import GenerationNodes from './GenerationNodes';

const columns = 10;
const rows = 10;
const spacing = 20;
const padding = 10;

const indexToX = (index) => (index % columns) * spacing + padding;
const indexToY = (index) => Math.trunc(index / rows) * spacing + padding;

const generationToNodes = ({ organisms }) => organisms.map((organism, index) => ({
  cx: indexToX(index),
  cy: indexToY(index),
  organism,
}));

function GenealogyVisualization({
  generations,
  maxFitness,
}) {
  // const theme = useTheme();

  // const genNodes = generations.map((gen) => generationToNodes(gen));
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
      {generations.map((gen) => (
        <GenerationNodes
          id={gen.id}
          key={gen.id}
          nodes={generationToNodes(gen)}
          maxFitness={maxFitness}
          width={200}
          height={200}
        />
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
