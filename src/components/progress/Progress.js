import React from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import OrganismCanvas from '../Canvases/OrganismCanvas';
import HistoryDisplay from './HistoryDisplay';
import StatusText from '../common/StatusText';

function SimulationStatusPanel() {
  const { organism } = useSelector((state) => state.simulation.currentBest);
  const stats = useSelector((state) => state.simulation.currentGenStats);
  const showContent = !!organism; // TODO: Use state hook

  return (
    <Paper>
      {showContent ? (
        <>
          <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={1}>
            <Box>
              <OrganismCanvas organism={organism} />
            </Box>
            <Box>
              <StatusText label="Generation">{stats.genId.toLocaleString() || 0}</StatusText>
              <StatusText label="Max Fitness">{stats.maxFitness?.toFixed(4) || 0}</StatusText>
              <StatusText label="Mean Fitness">{stats.meanFitness?.toFixed(4) || 0}</StatusText>
              <StatusText label="Min Fitness">{stats.minFitness?.toFixed(4) || 0}</StatusText>
              <StatusText label="Deviation">{stats.deviation?.toFixed(4) || 0}</StatusText>
              <StatusText label="Num △">{organism.genome.chromosomes.length || 0}</StatusText>
            </Box>
          </Stack>
          <HistoryDisplay />
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            color="GrayText"
            mt={3}
            mb={6}
            mx="auto"
          >
            Start a run to see a live view of fitness statistics and progress snapshots in this tab
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default SimulationStatusPanel;
