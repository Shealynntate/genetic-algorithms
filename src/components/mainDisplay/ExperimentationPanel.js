import React, { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
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
        <div key={createdOn}>
          {console.log({ parameters, stopCriteria, results })}
          <Typography>{new Date(createdOn).toLocaleTimeString()}</Typography>
        </div>
      ))}
      <Button startIcon={<Add />} variant="contained" onClick={onAddExperiment}>
        Add Experiment
      </Button>
      <ExperimentForm open={openForm} onClose={onCloseForm} />
    </Paper>
  );
}

export default ExperimentationPanel;
