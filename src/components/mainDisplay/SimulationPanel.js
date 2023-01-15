import React, { useRef, useState } from 'react';
import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import _ from 'lodash';
import {
  insertSimulation,
  useGetCompletedSimulations,
  useGetCurrentSimulation,
  useGetPendingSimulations,
} from '../../globals/database';
import { SimulationStatus } from '../../constants';
import SimulationChart from '../SimulationChart';
import SimulationButtons from '../SimulationButtons';
import SimulationEntry from '../SimulationEntry';
import SimulationDetails from '../SimulationDetails';
import SimulationFormDialog from '../SimulationFormDialog';
import RunningSimulationDisplay from '../RunningSimulationDisplay';
import defaultParameters from '../../globals/defaultParameters';

function SimulationPanel() {
  const runningSimulation = useGetCurrentSimulation();
  const completedSimulations = useGetCompletedSimulations() || [];
  const pendingSimulations = useGetPendingSimulations() || [];
  const [openForm, setOpenForm] = useState(false);
  const [checkedExperiments, setCheckedExperiments] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const formData = useRef(defaultParameters);

  const theme = useTheme();

  const lineColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,

    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.error.light,
    theme.palette.warning.light,
    theme.palette.info.light,
    theme.palette.success.light,

    theme.palette.primary.dark,
    theme.palette.secondary.dark,
    theme.palette.error.dark,
    theme.palette.warning.dark,
    theme.palette.info.dark,
    theme.palette.success.dark,
  ];

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

  // eslint-disable-next-line max-len
  const filteredExperiments = [...completedSimulations, runningSimulation].filter((entry) => (entry ? checkedExperiments.includes(entry.id) : false));

  const isChecked = (id) => checkedExperiments.includes(id);

  const onChangeCheckbox = (event, id) => {
    event.stopPropagation();

    if (event.target.checked) {
      setCheckedExperiments([...checkedExperiments, id]);
    } else {
      setCheckedExperiments(checkedExperiments.filter((item) => item !== id));
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

  const getCheckboxColor = (id) => {
    const index = checkedExperiments.indexOf(id);
    if (index < 0) return theme.palette.primary.main;
    return lineColors[index % lineColors.length];
  };

  return (
    <Paper>
      <Stack direction="row">
        <Stack>
          <SimulationButtons
            runsDisabled={!pendingSimulations.length}
          />
          <RunningSimulationDisplay
            color={getCheckboxColor(runningSimulation?.id)}
            isChecked={isChecked(runningSimulation?.id)}
            isSelected={selectedSimulation === runningSimulation?.id}
            onDuplicate={onDuplicate}
            onCheck={onChangeCheckbox}
            onSelect={onSelect}
            simulation={runningSimulation}
          />
          {pendingSimulations.length && <Typography>Waiting to be run</Typography>}
          {pendingSimulations.map((simulation) => (
            <SimulationEntry
              key={simulation.id}
              simulation={simulation}
              status={SimulationStatus.PENDING}
              isChecked={isChecked(simulation.id)}
              isSelected={selectedSimulation === simulation.id}
              onDuplicate={onDuplicate}
              onCheck={onChangeCheckbox}
              onSelect={onSelect}
              color={getCheckboxColor(simulation.id)}
            />
          ))}
          <Divider />
          <Button startIcon={<Add />} variant="contained" onClick={onAddSimulation}>
            Add Simulation
          </Button>
          <Typography>Completed Simulations</Typography>
          {completedSimulations.map((simulation) => (
            <SimulationEntry
              key={simulation.id}
              simulation={simulation}
              status={SimulationStatus.COMPLETE}
              isChecked={isChecked(simulation.id)}
              isSelected={selectedSimulation === simulation.id}
              onDuplicate={onDuplicate}
              onCheck={onChangeCheckbox}
              onSelect={onSelect}
              color={getCheckboxColor(simulation.id)}
            />
          ))}
        </Stack>
        <Stack direction="column">
          <SimulationChart simulations={filteredExperiments} />
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
