import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import _ from 'lodash';
import {
  insertSimulation,
  useGetCompletedSimulations,
  useGetCurrentSimulation,
  useGetPendingSimulations,
} from '../../globals/database';
import { canvasParameters, SimulationStatus } from '../../constants';
import { createImageData } from '../../globals/utils';
import Canvas from '../Canvas';
import GlobalBest from '../GlobalBest';
import SimulationChart from '../SimulationChart';
import SimulationButtons from '../SimulationButtons';
import SimulationEntry from '../SimulationEntry';
import SimulationDetails from '../SimulationDetails';
import SimulationFormDialog from '../SimulationFormDialog';

const { width, height } = canvasParameters;

function SimulationPanel() {
  const target = useSelector((state) => state.parameters.population.target);
  const runningSimulation = useGetCurrentSimulation();
  const completedSimulations = useGetCompletedSimulations() || [];
  const pendingSimulations = useGetPendingSimulations() || [];
  const [imageData, setImageData] = useState();
  const [openForm, setOpenForm] = useState(false);
  const [checkedExperiments, setCheckedExperiments] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    const updateImage = async () => {
      const result = await createImageData(target);
      if (isMounted) {
        setImageData(result);
      }
    };
    updateImage();

    return () => {
      isMounted = false;
    };
  }, [target]);

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
          {runningSimulation && (
            <>
              <Typography>Running Simulation</Typography>
              <SimulationEntry
                key={runningSimulation.id}
                id={runningSimulation.id}
                createdOn={runningSimulation.createdOn}
                name={runningSimulation.name}
                status={SimulationStatus.RUNNING}
                isChecked={isChecked(runningSimulation.id)}
                isSelected={selectedSimulation === runningSimulation.id}
                onCheck={onChangeCheckbox}
                onSelect={onSelect}
                color={getCheckboxColor(runningSimulation.id)}
              />
            </>
          )}
          <Stack direction="row">
            <Stack>
              <Canvas width={width} height={height} imageData={imageData} />
              <Typography variant="caption" pb={1}>Target</Typography>
            </Stack>
            <Stack>
              <GlobalBest />
              <Typography variant="caption" pb={1}>Current Best</Typography>
            </Stack>
          </Stack>
          {pendingSimulations.map(({ id, createdOn, name }) => (
            <SimulationEntry
              key={id}
              id={id}
              createdOn={createdOn}
              name={name}
              status={SimulationStatus.PENDING}
              isChecked={isChecked(id)}
              isSelected={selectedSimulation === id}
              onCheck={onChangeCheckbox}
              onSelect={onSelect}
              color={getCheckboxColor(id)}
            />
          ))}
          <Divider />
          <Button startIcon={<Add />} variant="contained" onClick={onAddSimulation}>
            Add Simulation
          </Button>
          <Typography>Completed Simulations</Typography>
          {completedSimulations.map(({
            id,
            createdOn,
            name,
          }) => (
            <SimulationEntry
              key={id}
              id={id}
              createdOn={createdOn}
              name={name}
              status={SimulationStatus.COMPLETE}
              isChecked={isChecked(id)}
              onCheck={onChangeCheckbox}
              isSelected={selectedSimulation === id}
              onSelect={onSelect}
              color={getCheckboxColor(id)}
            />
          ))}
        </Stack>
        <Stack direction="column">
          <SimulationChart simulations={filteredExperiments} />
          <SimulationDetails simulation={idToSimulation(selectedSimulation)} />
        </Stack>
      </Stack>
      <SimulationFormDialog open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default SimulationPanel;
