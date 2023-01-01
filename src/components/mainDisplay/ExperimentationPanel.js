import React, { useState } from 'react';
import {
  Box, Button, Paper, Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useGetAllExperiments } from '../../globals/database';
import ExperimentForm from '../ExperimentForm';
import { startExperiments } from '../../features/experimentation/experimentationSlice';

function ExperimentationPanel() {
  const experiments = useGetAllExperiments() || [];
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();

  const onAddExperiment = () => {
    setOpenForm(true);
  };

  const onCloseForm = (tests) => {
    setOpenForm(false);
    if (tests) {
      dispatch(startExperiments(tests));
    }
  };

  return (
    <Paper>
      {experiments.map(({
        createdOn,
        parameters,
        stopCriteria,
        results,
      }) => (
        <Box key={createdOn} style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '1rem' }}>
          {console.log({ stopCriteria })}
          <Typography>{new Date(createdOn).toLocaleTimeString()}</Typography>
          <Typography>{`Start: ${parameters.mutation.probMap.TWEAK.startValue}`}</Typography>
          <Typography>{`End: ${parameters.mutation.probMap.TWEAK.endValue}`}</Typography>
          {results.map(({ stats }) => (
            <React.Fragment key={stats.maxFitness}>
              <Typography>{`Gen: ${stats.genId}`}</Typography>
              <Typography>{`Max Fitness: ${stats.maxFitness}`}</Typography>
            </React.Fragment>
          ))}
        </Box>
      ))}
      <Button startIcon={<Add />} variant="contained" onClick={onAddExperiment}>
        Add Experiment
      </Button>
      <ExperimentForm open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default ExperimentationPanel;
