import React, { useRef, useState } from 'react';
import {
  Box,
  Fab,
  // IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  insertSimulation,
  useGetAllSimulations,
  useGetCurrentSimulation,
} from '../database/api';
import { SimulationStatus } from '../constants/typeDefinitions';
import SimulationChart from './SimulationChart';
import SimulationButtons from './SimulationButtons';
import SimulationEntry from './SimulationEntry';
import SimulationDetails from './SimulationDetails';
import SimulationFormDialog from './SimulationFormDialog';
import RunningSimulationDisplay from './RunningSimulationDisplay';
import defaultParameters from '../parameters/config';

const statusToOrder = {
  [SimulationStatus.RUNNING]: 0,
  [SimulationStatus.PAUSED]: 1,
  [SimulationStatus.PENDING]: 2,
  [SimulationStatus.COMPLETE]: 3,
  [SimulationStatus.UNKNOWN]: 4,
};

const sortSimulations = (simulations) => {
  const sorted = _.sortBy(simulations, (s) => statusToOrder[s.status]);
  return sorted;
};

function Simulations() {
  const theme = useTheme();
  const runningSimulation = useGetCurrentSimulation();
  const simulations = useGetAllSimulations() || [];
  const allSimulations = sortSimulations(simulations);
  const queuedSimulations = allSimulations.filter((s) => s.status === SimulationStatus.PENDING);
  const formData = useRef(defaultParameters);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const idToSimulation = (id) => {
    const all = [...allSimulations, runningSimulation];
    return _.find(all, (e) => e?.id === id);
  };

  const onAddSimulation = () => {
    setOpenForm(true);
  };

  const onCloseForm = (parameters) => {
    setOpenForm(false);
    formData.current = defaultParameters;
    if (parameters) {
      insertSimulation({
        parameters,
        status: SimulationStatus.PENDING,
      });
    }
  };

  const onSelect = (id) => {
    setSelectedSimulation(id);
  };

  const onDuplicate = (event, id) => {
    event.stopPropagation();

    const sim = idToSimulation(id);
    formData.current = sim.parameters;
    setOpenForm(true);
  };

  return (
    <Stack>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>Experiment</Typography>
      <SimulationChart />
      <Grid2 container mt={1}>
        <Grid2 xs={12} md={6}>
          <Stack
            sx={{
              backgroundColor: theme.palette.grey[100],
              borderRadius: theme.shape.borderRadius,
              p: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography variant="h6">Experiment Runs</Typography>
                <SimulationButtons runsDisabled={queuedSimulations.length === 0} />
              </Stack>
              <Tooltip title="Add a new run">
                <Fab
                  onClick={onAddSimulation}
                  color="secondary"
                  size="extrasmall"
                  sx={{ boxShadow: 'none' }}
                >
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Box>
            <Stack spacing={0.5}>
              {allSimulations.map((simulation) => (
                <SimulationEntry
                  key={simulation.id}
                  simulation={simulation}
                  isSelected={selectedSimulation === simulation.id}
                  onDuplicate={onDuplicate}
                  onSelect={onSelect}
                />
              ))}
            </Stack>
          </Stack>
        </Grid2>
        <Grid2 xs={12} md={6} spacing={1}>
          <RunningSimulationDisplay
            isSelected={selectedSimulation === runningSimulation?.id}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
            simulation={runningSimulation}
          />
          <SimulationDetails simulation={idToSimulation(selectedSimulation)} />
        </Grid2>
      </Grid2>
      <SimulationFormDialog
        defaultValues={formData.current}
        open={openForm}
        onClose={onCloseForm}
      />
    </Stack>
  );
}

export default Simulations;
