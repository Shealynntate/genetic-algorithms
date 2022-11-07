import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { OrganismNodeType } from '../types';
import { canvasParameters, statusLabels } from '../constants';
import { createImage, maxFitOrganism } from '../models/utils';
import square from '../assets/red_square_test.png';
import Genome from '../models/genome';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);
  const canvasRef1 = useRef();
  const canvasRef2 = useRef();

  const { width, height } = canvasParameters;

  // const points = [
  //   [0, 0],
  //   [0, height],
  //   [250000, 90],
  // ];
  // const color = [255, 37, 1, 1];

  useEffect(() => {
    if (canvasRef1.current && canvasRef2.current) {
      const ctx1 = canvasRef1.current.getContext('2d');
      const genome = new Genome({ size: 2 });
      ctx1.putImageData(genome.getPhenotype(), 0, 0);

      const ctx2 = canvasRef2.current.getContext('2d');
      createImage(square, (image) => {
        ctx2.drawImage(image, 0, 0, width, height);
        console.log(ctx2.getImageData(0, 0, width, height));
        const pixels = ctx2.getImageData(0, 0, width, height).data;
        const fitness = genome.evaluateFitness(pixels);
        console.log(fitness);
        // const data = ctx.getImageData(0, 0, width, height);
      });
    }
  }, [canvasRef1, canvasRef2]);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Best Organism: ${best?.genome}`}</Typography>
      <canvas ref={canvasRef1} width={width} height={height} />
      <canvas ref={canvasRef2} width={width} height={height} />
    </Paper>
  );
}

SimulationStatusPanel.propTypes = {
  genCount: PropTypes.number,
  currentGen: PropTypes.shape(OrganismNodeType),
  styles: PropTypes.objectOf(PropTypes.string),
};

SimulationStatusPanel.defaultProps = {
  genCount: 0,
  currentGen: {},
  styles: {},
};

export default SimulationStatusPanel;
