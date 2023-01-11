import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import {
  deleteSimulation,
  insertSimulation,
  useGetCompletedSimulations,
  useGetCurrentSimulation,
  useGetPendingSimulations,
} from '../../globals/database';
import SimulationForm from '../SimulationForm';
import {
  canvasParameters,
  DistributionTypes, ProbabilityTypes, SimulationStatus,
} from '../../constants';
import { createImageData } from '../../globals/utils';
import Canvas from '../Canvas';
import GlobalBest from '../GlobalBest';
import SimulationChart from '../SimulationChart';
import PrimaryButton from '../PrimaryButton';

const { width, height } = canvasParameters;

function SimulationPanel() {
  const target = useSelector((state) => state.parameters.population.target);
  const [imageData, setImageData] = useState();
  const runningSimulation = useGetCurrentSimulation();
  const completedSimulations = useGetCompletedSimulations() || [];
  const pendingSimulations = useGetPendingSimulations() || [];
  const [openForm, setOpenForm] = useState(false);
  const [checkedExperiments, setCheckedExperiments] = useState([]);
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

  const onAddSimulation = () => {
    setOpenForm(true);
  };

  const onDeleteSimulation = (id) => {
    deleteSimulation(id);
  };

  const onCloseForm = (data) => {
    setOpenForm(false);
    if (data) {
      insertSimulation({
        parameters: data.parameters,
        status: SimulationStatus.PENDING,
        stopCriteria: data.stopCriteria,
      });
    }
  };

  // eslint-disable-next-line max-len
  const filteredExperiments = completedSimulations.filter((entry) => checkedExperiments.includes(entry.id));

  const isChecked = (id) => checkedExperiments.includes(id);

  const onChangeCheckbox = (event, id) => {
    event.stopPropagation();

    if (event.target.checked) {
      setCheckedExperiments([...checkedExperiments, id]);
    } else {
      setCheckedExperiments(checkedExperiments.filter((item) => item !== id));
    }
  };

  const getCheckboxColor = (id) => {
    const index = checkedExperiments.indexOf(id);
    if (index < 0) return theme.palette.primary.main;
    return lineColors[index % lineColors.length];
  };

  const onDeleteQueuedExperiment = (id) => {
    deleteSimulation(id);
  };

  return (
    <Paper>
      <Stack direction="row">
        <Stack>
          <PrimaryButton
            runsDisabled={!pendingSimulations.length}
          />
          {runningSimulation && (
            <Accordion sx={{ padding: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    alignItems: 'center',
                  },
                }}
              >
                <Typography pr={2}>{`Running Test ${runningSimulation.id}`}</Typography>
              </AccordionSummary>
            </Accordion>
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
          <Button startIcon={<Add />} variant="contained" onClick={onAddSimulation}>
            Add Simulation
          </Button>
          {pendingSimulations.map(({ id, parameters, stopCriteria }) => (
            <Accordion sx={{ padding: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    alignItems: 'center',
                  },
                }}
              >
                <Typography pr={2}>{`Pending Test ${id}`}</Typography>
                <IconButton color="error" onClick={() => onDeleteQueuedExperiment(id)}>
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1">Parameters</Typography>
                    <Divider />
                    <Stack direction="row">
                      <Box pr={1}>
                        <Typography>Selection</Typography>
                        <Typography>{`Type: ${parameters.selection.type}`}</Typography>
                        <Typography>{`Elites: ${parameters.selection.eliteCount}`}</Typography>
                        <Typography>{`Tournament Size: ${parameters.selection.tournamentSize}`}</Typography>
                      </Box>
                      <Box>
                        <Typography>Mutation</Typography>
                        <Typography>{`color sigma: ${parameters.mutation[DistributionTypes.COLOR_SIGMA]}`}</Typography>
                        <Typography>{`point sigma: ${parameters.mutation[DistributionTypes.POINT_SIGMA]}`}</Typography>
                        {Object.keys(parameters.mutation.probabilities).map((probKey) => (
                          <React.Fragment key={probKey}>
                            <Typography>{ProbabilityTypes[probKey]}</Typography>
                            <Typography variant="body2">
                              {`${parameters.mutation.probabilities[probKey].startValue} -->
                                ${parameters.mutation.probabilities[probKey].endValue}
                              `}
                            </Typography>
                          </React.Fragment>
                        ))}
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Box>
                      <Typography variant="subtitle1">Stop Criteria</Typography>
                      <Divider />
                      <Typography>{`Target fitness: ${stopCriteria.targetFitness}`}</Typography>
                      <Typography>{`Max Generations: ${stopCriteria.maxGenerations}`}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
          <Divider />
          {completedSimulations.map(({
            id,
            createdOn,
            parameters,
            stopCriteria,
            results,
          }) => (
            <Accordion key={id} sx={{ padding: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    alignItems: 'center',
                  },
                }}
              >
                <Checkbox
                  checked={isChecked(id)}
                  onClick={(event) => onChangeCheckbox(event, id)}
                  sx={{
                    color: getCheckboxColor(id),
                    '&.Mui-checked': {
                      color: getCheckboxColor(id),
                    },
                  }}
                />
                <Typography pr={2}>{`Test ${id}`}</Typography>
                <Typography sx={{ color: theme.palette.text.secondary, pr: 2 }}>
                  {new Date(createdOn).toLocaleString()}
                </Typography>
                <IconButton color="error" onClick={() => onDeleteSimulation(id)}>
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1">Parameters</Typography>
                    <Divider />
                    <Stack direction="row">
                      <Box pr={1}>
                        <Typography>Population</Typography>
                        <Typography>{`Size: ${parameters.population.size}`}</Typography>
                        <Typography>Selection</Typography>
                        <Typography>{`Type: ${parameters.selection.type}`}</Typography>
                        <Typography>{`Elites: ${parameters.selection.eliteCount}`}</Typography>
                        <Typography>{`Tournament Size: ${parameters.selection.tournamentSize}`}</Typography>
                      </Box>
                      <Box>
                        <Typography>Mutation</Typography>
                        <Typography>{`color sigma: ${parameters.mutation[DistributionTypes.COLOR_SIGMA]}`}</Typography>
                        <Typography>{`point sigma: ${parameters.mutation[DistributionTypes.POINT_SIGMA]}`}</Typography>
                        {Object.keys(parameters.mutation.probabilities).map((probKey) => (
                          <React.Fragment key={probKey}>
                            <Typography>{ProbabilityTypes[probKey]}</Typography>
                            <Typography variant="body2">
                              {`${parameters.mutation.probabilities[probKey].startValue} -->
                                ${parameters.mutation.probabilities[probKey].endValue}
                              `}
                            </Typography>
                          </React.Fragment>
                        ))}
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">Results</Typography>
                    <Divider />
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Typography variant="subtitle1">Gen</Typography>
                      <Typography variant="subtitle1">Best</Typography>
                    </Stack>
                    {results.map(({ stats }) => (
                      <Stack
                        key={stats.maxFitness}
                        direction="row"
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <Typography variant="body2">{stats.genId}</Typography>
                        <Typography variant="body2">{stats.maxFitness}</Typography>
                      </Stack>
                    ))}
                    <Box>
                      <Typography variant="subtitle1">Stop Criteria</Typography>
                      <Divider />
                      <Typography>{`Target fitness: ${stopCriteria.targetFitness}`}</Typography>
                      <Typography>{`Max Generations: ${stopCriteria.maxGenerations}`}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
        <SimulationChart
          checkedExperiments={filteredExperiments}
        />
      </Stack>
      <SimulationForm open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default SimulationPanel;
