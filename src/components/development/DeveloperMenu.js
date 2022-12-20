import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useDispatch } from 'react-redux';
import { getCurrentImages, getCurrentParameters } from '../../globals/database';
import { downloadJSON } from '../../globals/utils';
import store from '../../store';
import JsonInput from '../JsonInput';
import { download } from '../../features/developer/developerSlice';

function DeveloperMenu({ open, onClose }) {
  const [imageTitle, setImageTitle] = useState('');
  const [stateTitle, setStateTitle] = useState('ga-simulation-state');
  const dispatch = useDispatch();

  const onImageDownloadClick = async () => {
    const metadata = await getCurrentParameters();
    const history = await getCurrentImages();
    // Strip out the unneeded data for the JSON file
    const contents = omit(metadata, ['id']);
    contents.name = imageTitle;
    contents.images = history.map((entry) => omit(entry, ['imageData']));

    downloadJSON(imageTitle, contents);
  };

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
          <Button
            variant="contained"
            sx={{ display: 'block' }}
            onClick={onImageDownloadClick}
            disabled={!imageTitle}
          >
            Download
          </Button>
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
