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
import { useImageDbQuery } from '../hooks';
import { createGif } from '../globals/utils';
import OrganismCanvas from './OrganismCanvas';
import { getCurrentImages } from '../globals/database';
import HistoryDisplay from './HistoryDisplay';

function StatusText({ children }) {
  return <Typography variant="caption" sx={{ display: 'block' }}>{children}</Typography>;
}

StatusText.propTypes = {
  children: PropTypes.node.isRequired,
};

const fileName = 'ga-image-timelapse';

function SimulationStatusPanel() {
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const images = useImageDbQuery() || [];
  const { maxFitOrganism } = currentGen;

  const downloadGif = async () => {
    const history = await getCurrentImages();
    const imageData = history.map((entry) => entry.imageData);
    const lastImg = imageData[imageData.length - 1];
    // Show the last image 4 times as long in the gif
    createGif([...imageData, lastImg, lastImg, lastImg], fileName);
  };

  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <Typography>Current Best</Typography>
          {maxFitOrganism && <OrganismCanvas organism={maxFitOrganism} />}
          <StatusText>{`Generation: ${currentGen.id || 0}`}</StatusText>
          <StatusText>{`Fitness: ${maxFitOrganism?.fitness.toFixed(4) || 0}`}</StatusText>
          <StatusText>{`Deviation: ${currentGen.deviation?.toFixed(4) || 0}`}</StatusText>
        </Box>
        <Button
          variant="contained"
          onClick={() => { downloadGif(); }}
          sx={{ height: 'fit-content', margin: 'auto 0' }}
        >
          Make it a gif!
        </Button>
      </Stack>
      <HistoryDisplay images={images} />
    </Paper>
  );
}

export default SimulationStatusPanel;
