import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useInExperimentationMode, useIsRunning } from '../../hooks';
import { createGif, chromosomesToPhenotype, download } from '../../globals/utils';
import { getCurrentImages } from '../../globals/database';
import HistoryDisplay from '../HistoryDisplay';

function StatusText({ children }) {
  return <Typography variant="caption" sx={{ display: 'block' }}>{children}</Typography>;
}

StatusText.propTypes = {
  children: PropTypes.node.isRequired,
};

const fileName = 'ga-image-timelapse';

function SimulationStatusPanel() {
  const globalBest = useSelector((state) => state.simulation.globalBest);
  const stats = useSelector((state) => state.simulation.currentStats);
  const isRunning = useIsRunning();
  const isExperiment = useInExperimentationMode();

  const downloadGif = async () => {
    const history = await getCurrentImages();
    const imageData = history.map((entry) => entry.imageData);
    const { chromosomes } = globalBest.organism.genome;
    const phenotype = chromosomesToPhenotype(chromosomes);
    // Show the last image 4 times as long in the gif
    const result = [...imageData, phenotype, phenotype, phenotype, phenotype];
    const gif = await createGif(result);
    download(fileName, gif);
  };

  if (isExperiment) {
    return (
      <Paper>
        <Typography>Running Experiments</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <StatusText>{`Generation: ${stats.genId || 0}`}</StatusText>
          <StatusText>{`Fitness: ${stats.maxFitness?.toFixed(4) || 0}`}</StatusText>
          <StatusText>{`Deviation: ${stats.deviation?.toFixed(4) || 0}`}</StatusText>
        </Box>
        <Button
          variant="contained"
          onClick={() => { downloadGif(); }}
          sx={{ height: 'fit-content', margin: 'auto 0' }}
          disabled={isRunning}
        >
          Make it a gif!
        </Button>
      </Stack>
      <HistoryDisplay />
    </Paper>
  );
}

export default SimulationStatusPanel;
