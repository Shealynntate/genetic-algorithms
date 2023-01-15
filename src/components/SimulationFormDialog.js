import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SimulationForm from './SimulationForm';

function SimulationFormDialog({ open, onClose }) {
  // Send to database and close form
  const onSubmit = (data) => {
    onClose(data);
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="xl">
      <DialogTitle sx={{ py: 0.5 }}>Simulation Setup</DialogTitle>
      <DialogContent>
        <SimulationForm
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

SimulationFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SimulationFormDialog.defaultProps = {
  open: false,
  onClose: () => {},
};

export default SimulationFormDialog;
