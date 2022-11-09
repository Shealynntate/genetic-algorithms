import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GenerationNodeType } from '../types';
import { canvasParameters, statusLabels } from '../constants';
import { createImage, maxFitOrganism } from '../models/utils';
import square from '../assets/red_square_test.png';
import Organism from '../models/organism';
import OrganismCanvas from './OrganismCanvas';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);
  const canvasRef2 = useRef();

  const { width, height } = canvasParameters;

  const organism1 = new Organism({ genomeSize: 2 });
  const organism2 = new Organism({ genomeSize: 2 });
  const child = Organism.reproduce(organism1, organism2, 0.001);

  useEffect(() => {
    if (canvasRef2.current) {
      const ctx2 = canvasRef2.current.getContext('2d');
      createImage(square, (image) => {
        ctx2.drawImage(image, 0, 0, width, height);
        console.log(child);
        // const pixels = ctx2.getImageData(0, 0, width, height).data;
        // const fitness = genome.evaluateFitness(pixels);
        // console.log(fitness);
        // const data = ctx.getImageData(0, 0, width, height);
      });
    }
  }, [canvasRef2]);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Best Organism: ${best?.genome}`}</Typography>
      {best && <OrganismCanvas organism={best} />}
      {/* <OrganismCanvas organism={child} /> */}
      <canvas ref={canvasRef2} width={width} height={height} />
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  genCount: PropTypes.number,
  currentGen: PropTypes.shape(GenerationNodeType),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: {},
  styles: {},
};

export default SimulationStatusPanel;
