import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { primaryButtonLabels } from '../constants';

function PrimaryButton({ currentState, callback }) {
  return (
    <Button
      variant="contained"
      onClick={callback}
    >
      {primaryButtonLabels[currentState]}
    </Button>
  );
}

PrimaryButton.propTypes = {
  currentState: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default PrimaryButton;
