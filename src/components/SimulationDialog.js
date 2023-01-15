import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SimulationForm from './SimulationForm';

function SimulationDialog({ open, onClose }) {
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

SimulationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SimulationDialog.defaultProps = {
  open: false,
  onClose: () => {},
};

export default SimulationDialog;
