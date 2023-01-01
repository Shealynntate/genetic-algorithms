import React, { useState } from 'react';
import {
  Box, Button, IconButton, List, ListItem, Paper, Stack, Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deleteExperiment, useGetAllExperiments } from '../../globals/database';
import ExperimentForm from '../ExperimentForm';
import { startExperiments } from '../../features/experimentation/experimentationSlice';

function ExperimentationPanel() {
  const experiments = useGetAllExperiments() || [];
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();

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

  return (
    <Paper>
      <List>
        {experiments.map(({
          id,
          createdOn,
          parameters,
          stopCriteria,
          results,
        }) => (
          <ListItem key={id} sx={{ display: 'block' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography>{new Date(createdOn).toLocaleString()}</Typography>
              <IconButton color="error" onClick={() => onDeleteExperiment(id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Stack direction="row">
              <Box>
                <Typography variant="subtitle1">Parameters</Typography>
                <Typography>{`Start: ${parameters.mutation.probMap.TWEAK.startValue}`}</Typography>
                <Typography>{`End: ${parameters.mutation.probMap.TWEAK.endValue}`}</Typography>
                <Typography variant="subtitle1">Stop Criteria</Typography>
                <Typography>{`Target fitness: ${stopCriteria.targetFitness}`}</Typography>
                <Typography>{`Max Generations: ${stopCriteria.maxGenerations}`}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Results</Typography>
                {results.map(({ stats }) => (
                  <React.Fragment key={stats.maxFitness}>
                    <Typography>{`Gen: ${stats.genId}`}</Typography>
                    <Typography>{`Max Fitness: ${stats.maxFitness}`}</Typography>
                  </React.Fragment>
                ))}
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Button startIcon={<Add />} variant="contained" onClick={onAddExperiment}>
        Add Experiment
      </Button>
      <ExperimentForm open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default ExperimentationPanel;
