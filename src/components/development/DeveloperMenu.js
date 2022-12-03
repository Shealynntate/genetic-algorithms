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
import { getCurrentImages, getCurrentMetadata } from '../../globals/database';
import { downloadFile } from '../../globals/utils';

function DeveloperMenu({ open, onClose }) {
  const [imageTitle, setImageTitle] = useState();

  const onClick = async () => {
    const metadata = await getCurrentMetadata();
    const history = await getCurrentImages();
    // Strip out the unneeded data for the JSON file
    const contents = omit(metadata, ['id']);
    contents.name = imageTitle;
    contents.images = history.map((entry) => omit(entry, ['imageData']));

    downloadFile(imageTitle, contents);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Developer Options</DialogTitle>
      <DialogContent>
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
          onClick={onClick}
          disabled={!imageTitle}
        >
          Download
        </Button>
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
