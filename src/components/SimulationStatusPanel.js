import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GenerationNodeType } from '../types';
import { canvasParameters, statusLabels } from '../constants';
import { createImage, maxFitOrganism } from '../models/utils';
import square from '../assets/red_square_test.png';
import OrganismCanvas from './OrganismCanvas';

function SimulationStatusPanel({ currentGen, genCount, styles }) {
  const simulationState = useSelector((state) => state.ux.simulationState);
  const status = statusLabels[simulationState];
  const best = maxFitOrganism(currentGen.organisms);
  const canvasRef2 = useRef();

  const { width, height } = canvasParameters;

  useEffect(() => {
    if (canvasRef2.current) {
      const ctx2 = canvasRef2.current.getContext('2d');
      createImage(square, (image) => {
        ctx2.drawImage(image, 0, 0, width, height);
      });
    }
  }, []);

  return (
    <Paper sx={styles}>
      <Typography>{`Status: ${status}`}</Typography>
      <Typography>{`Current Generation: ${genCount}`}</Typography>
      <Typography>{`Fitness: ${best?.fitness || 0}`}</Typography>
      {best && <OrganismCanvas organism={best} willReadFrequently />}
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
