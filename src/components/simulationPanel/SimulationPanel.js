import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import _ from 'lodash';
import {
  insertSimulation,
  useGetCompletedSimulations,
  useGetCurrentSimulation,
  useGetPendingSimulations,
} from '../../globals/database';
import { SimulationStatus } from '../../constants';
import SimulationChart from './SimulationChart';
import SimulationButtons from './SimulationButtons';
import SimulationEntry from './SimulationEntry';
import SimulationDetails from './SimulationDetails';
import SimulationFormDialog from './SimulationFormDialog';
import RunningSimulationDisplay from './RunningSimulationDisplay';
import defaultParameters from '../../globals/defaultParameters';
import Panel from '../settingsPanels/Panel';

function SimulationPanel() {
  const runningSimulation = useGetCurrentSimulation();
  const completedSimulations = useGetCompletedSimulations() || [];
  const pendingSimulations = useGetPendingSimulations() || [];
  const formData = useRef(defaultParameters);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const idToSimulation = (id) => {
    const all = [...completedSimulations, ...pendingSimulations, runningSimulation];
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
    <Paper>
      <Stack direction="row" spacing={1}>
        <Stack>
          <SimulationButtons
            runsDisabled={!pendingSimulations.length}
          />
          <RunningSimulationDisplay
            isSelected={selectedSimulation === runningSimulation?.id}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
            simulation={runningSimulation}
          />
          <Panel label="Queued Runs">
            {pendingSimulations.map((simulation) => (
              <SimulationEntry
                key={simulation.id}
                simulation={simulation}
                status={SimulationStatus.PENDING}
                isSelected={selectedSimulation === simulation.id}
                onDuplicate={onDuplicate}
                onSelect={onSelect}
              />
            ))}
            <Box sx={{ textAlign: 'center' }}>
              <Button startIcon={<Add />} variant="outlined" color="secondary" onClick={onAddSimulation}>
                New
              </Button>
            </Box>
          </Panel>
          <Panel label="Completed Runs">
            {completedSimulations.map((simulation) => (
              <SimulationEntry
                key={simulation.id}
                simulation={simulation}
                status={SimulationStatus.COMPLETE}
                isSelected={selectedSimulation === simulation.id}
                onDuplicate={onDuplicate}
                onSelect={onSelect}
              />
            ))}
          </Panel>
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
    </Paper>
  );
}

export default SimulationPanel;
