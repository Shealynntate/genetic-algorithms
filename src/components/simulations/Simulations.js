import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import _ from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {
  insertSimulation,
  useGetAllSimulations,
  useGetCurrentSimulation,
} from '../../global/database';
import { SimulationStatus } from '../../constants/typeDefinitions';
import SimulationChart from './SimulationChart';
import SimulationButtons from './SimulationButtons';
import SimulationEntry from './SimulationEntry';
import SimulationDetails from './SimulationDetails';
import SimulationFormDialog from './SimulationFormDialog';
import RunningSimulationDisplay from './RunningSimulationDisplay';
import defaultParameters from '../../constants/defaultParameters';

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
    <Box>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>Experiment</Typography>
      <Grid2 container>
        <Grid2 xs={12} md={5}>
          <RunningSimulationDisplay
            isSelected={selectedSimulation === runningSimulation?.id}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
            simulation={runningSimulation}
          />
          <SimulationButtons
            runsDisabled={queuedSimulations.length === 0}
          />
          <Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Runs</Typography>
              <Tooltip title="Add a new run">
                <IconButton
                  onClick={onAddSimulation}
                  color="secondary"
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            </Box>
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
        </Grid2>
        <Grid2 xs={12} md={7} spacing={1}>
          <SimulationChart />
          <SimulationDetails simulation={idToSimulation(selectedSimulation)} />
        </Grid2>
      </Grid2>
      <SimulationFormDialog
        defaultValues={formData.current}
        open={openForm}
        onClose={onCloseForm}
      />
    </Box>
  );
}

export default Simulations;
