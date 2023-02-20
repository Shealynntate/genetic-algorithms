import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SimulationForm from '../form/SimulationForm';
import { ParametersType } from '../../types';
import defaultParameters from '../../globals/defaultParameters';

function SimulationFormDialog({ defaultValues, open, onClose }) {
  // Send to database and close form
  const onSubmit = (data) => {
    onClose(data);
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="xl">
      <DialogTitle sx={{ py: 0.5 }}>Simulation Setup</DialogTitle>
      <DialogContent>
        <SimulationForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

SimulationFormDialog.propTypes = {
  defaultValues: PropTypes.shape(ParametersType),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SimulationFormDialog.defaultProps = {
  defaultValues: defaultParameters,
  open: false,
  onClose: () => {},
};

export default SimulationFormDialog;
