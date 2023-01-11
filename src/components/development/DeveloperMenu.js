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
import { useSelector } from 'react-redux';
import { getCurrentImages } from '../../globals/database';
import { chromosomesToPhenotype, createGif, downloadJSON } from '../../globals/utils';

function DeveloperMenu({ open, onClose }) {
  const [entryTitle, setEntryTitle] = useState('Untitled');
  const globalBest = useSelector((state) => state.simulation.globalBest);
  const parameters = useSelector((state) => state.parameters);
  const currentBest = useSelector((state) => state.simulation.currentBest);

  const onAppStateDownloadClick = async () => {
    // Download for gallery
    const history = await getCurrentImages();
    const imageData = history.map((entry) => entry.imageData);
    const { chromosomes } = globalBest.organism.genome;
    const phenotype = chromosomesToPhenotype(chromosomes);
    // Show the last image 4 times as long in the gif
    const result = [...imageData, phenotype, phenotype, phenotype, phenotype];
    const gif = await createGif(result);
    const galleryData = {
      name: entryTitle,
      gif,
      globalBest,
      parameters,
      totalGen: currentBest.genId,
    };
    downloadJSON(entryTitle, galleryData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Developer Options</DialogTitle>
      <DialogContent sx={{ display: 'flex' }}>
        <Box px={1}>
          <DialogContentText>Download Gallery Entry</DialogContentText>
          <TextField
            label="Entry Title"
            value={entryTitle}
            onChange={({ target }) => { setEntryTitle(target.value); }}
            required
          />
        </Box>
        <Button
          variant="contained"
          sx={{ display: 'block' }}
          onClick={onAppStateDownloadClick}
          disabled={!entryTitle}
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
