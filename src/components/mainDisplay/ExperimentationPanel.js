import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { scaleLinear } from '@visx/scale';
import { useTheme } from '@emotion/react';
import { Grid } from '@visx/grid';
import { AxisLeft } from '@visx/axis';
import { deleteExperiment, useGetAllExperiments } from '../../globals/database';
import ExperimentForm from '../ExperimentForm';
import { minExperimentThreshold, MutationProbabilityLabels } from '../../constants';
import { startExperiments } from '../../features/experimentation/experimentationSlice';
import ExperimentLine from '../ExperimentLine';

const graphWidth = 600;
const graphHeight = 400;

function ExperimentationPanel() {
  const experiments = useGetAllExperiments() || [];
  const [openForm, setOpenForm] = useState(false);
  const [checkedExperiments, setCheckedExperiments] = useState([]);
  const dispatch = useDispatch();
  const theme = useTheme();

  const axisColor = theme.palette.grey[400];

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

  const onAddExperiment = () => {
    setOpenForm(true);
  };

  const onDeleteExperiment = (id) => {
    deleteExperiment(id);
  };

  const onCloseForm = (tests) => {
    setOpenForm(false);
    if (tests) {
      dispatch(startExperiments(tests));
    }
  };

  const filteredExperiments = experiments.filter((entry) => checkedExperiments.includes(entry.id));

  const genData = (results) => results.map(({ stats }) => ({
    x: stats.genId,
    y: stats.maxFitness,
  }));

  const yScale = useMemo(
    () => scaleLinear({
      range: [graphHeight, 0],
      domain: [minExperimentThreshold, 1],
    }),
    [],
  );

  const xScale = useMemo(
    () => scaleLinear({
      range: [0, graphWidth],
      domain: [100, 16000],
    }),
    [],
  );

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

  return (
    <Paper>
      <svg width={graphWidth} height={graphHeight}>
        <Grid
          xScale={xScale}
          yScale={yScale}
          width={graphWidth}
          height={graphHeight}
          stroke="white"
          strokeOpacity={0.10}
        />
        <AxisLeft
          scale={yScale}
          top={0}
          left={30}
          tickValues={yScale.ticks()}
          tickStroke={axisColor}
          tickLength={4}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 9,
            textAnchor: 'end',
            dx: -1,
            dy: 3,
          })}
        />
        {filteredExperiments.map(({ id, results }, index) => (
          <ExperimentLine
            key={`graph-${id}`}
            data={genData(results)}
            xScale={xScale}
            yScale={yScale}
            color={lineColors[index % lineColors.length]}
          />
        ))}
      </svg>
      <Container
        sx={{
          px: 0,
          [theme.breakpoints.up('md')]: {
            px: 0,
          },
        }}
      >
        {experiments.map(({
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
              <IconButton color="error" onClick={() => onDeleteExperiment(id)}>
                <DeleteIcon />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">Parameters</Typography>
                  <Divider />
                  <Stack direction="row">
                    <Box>
                      <Typography>Selection</Typography>
                      <Typography>{`Type: ${parameters.selection.type}`}</Typography>
                    </Box>
                    <Box>
                      <Typography>Mutation</Typography>
                      <Typography>{`color sigma: ${parameters.mutation.colorSigma}`}</Typography>
                      <Typography>{`point sigma: ${parameters.mutation.colorSigma}`}</Typography>
                      {Object.keys(parameters.mutation.probMap).map((probKey) => (
                        <>
                          <Typography>{MutationProbabilityLabels[probKey]}</Typography>
                          <Typography variant="body2">
                            {`${parameters.mutation.probMap[probKey].startValue} -->
                              ${parameters.mutation.probMap[probKey].endValue}
                            `}
                          </Typography>
                        </>
                      ))}
                    </Box>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle1">Results</Typography>
                  <Divider />
                  {results.map(({ stats }) => (
                    <Stack
                      key={stats.maxFitness}
                      direction="row"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">{`Gen ${stats.genId}`}</Typography>
                      <Typography variant="body2">{`Best: ${stats.maxFitness}`}</Typography>
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
      </Container>
      <Button startIcon={<Add />} variant="contained" onClick={onAddExperiment}>
        Add Experiment
      </Button>
      <ExperimentForm open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default ExperimentationPanel;
