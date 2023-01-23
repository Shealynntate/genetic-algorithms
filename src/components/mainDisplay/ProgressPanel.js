import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import HistoryDisplay from '../HistoryDisplay';

function StatusText({ children }) {
  return <Typography variant="caption" sx={{ display: 'block' }}>{children}</Typography>;
}

StatusText.propTypes = {
  children: PropTypes.node.isRequired,
};

function SimulationStatusPanel() {
  const stats = useSelector((state) => state.simulation.currentStats);

  return (
    <Paper>
      <Stack direction="row">
        <Box>
          <StatusText>{`Generation: ${stats.genId || 0}`}</StatusText>
          <StatusText>{`Fitness: ${stats.maxFitness?.toFixed(4) || 0}`}</StatusText>
          <StatusText>{`Deviation: ${stats.deviation?.toFixed(4) || 0}`}</StatusText>
        </Box>
      </Stack>
      <HistoryDisplay />
    </Paper>
  );
}

export default SimulationStatusPanel;
