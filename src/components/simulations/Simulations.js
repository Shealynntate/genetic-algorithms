import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import _ from 'lodash';
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

function Simulations() {
  const runningSimulation = useGetCurrentSimulation();
  const allSimulations = useGetAllSimulations() || [];
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
      <Stack direction="row" spacing={1}>
        <Stack>
          <SimulationButtons
            runsDisabled={!allSimulations.length}
          />
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Button startIcon={<Add />} variant="contained" color="secondary" onClick={onAddSimulation}>
              New
            </Button>
          </Box>
          <RunningSimulationDisplay
            isSelected={selectedSimulation === runningSimulation?.id}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
            simulation={runningSimulation}
          />
          <Stack>
            <Typography variant="h6">List of runs</Typography>
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
        <Stack direction="column" spacing={1}>
          <SimulationChart />
          <SimulationDetails simulation={idToSimulation(selectedSimulation)} />
        </Stack>
      </Stack>
      <SimulationFormDialog
        defaultValues={formData.current}
        open={openForm}
        onClose={onCloseForm}
      />
    </Box>
  );
}

export default Simulations;
