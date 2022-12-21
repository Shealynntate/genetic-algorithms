import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import store from '../../store';
import JsonInput from '../JsonInput';
import { download } from '../../features/developer/developerSlice';

function DeveloperMenu({ open, onClose }) {
  const [imageTitle, setImageTitle] = useState('');
  const [stateTitle, setStateTitle] = useState('ga-simulation-state');
  const dispatch = useDispatch();

  const onSimulationStateDownloadClick = () => {
    // downloadJSON(stateTitle, store.getState());
    dispatch(download(stateTitle, store.getState()));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Developer Options</DialogTitle>
      <DialogContent sx={{ display: 'flex' }}>
        <Box px={1}>
          <DialogContentText>Download Image History</DialogContentText>
          <TextField
            label="Image Title"
            value={imageTitle}
            onChange={({ target }) => { setImageTitle(target.value); }}
            required
          />
        </Box>
        <Box px={1}>
          <DialogContentText>Download Simulation State</DialogContentText>
          <TextField
            label="File Title"
            value={stateTitle}
            onChange={({ target }) => { setStateTitle(target.value); }}
            required
          />
          <Button
            variant="contained"
            sx={{ display: 'block' }}
            onClick={onSimulationStateDownloadClick}
            disabled={!stateTitle}
          >
            Download
          </Button>
        </Box>
        <Box>
          <JsonInput />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

DeveloperMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

DeveloperMenu.defaultProps = {
  open: false,
  onClose: () => {},
};

export default DeveloperMenu;
