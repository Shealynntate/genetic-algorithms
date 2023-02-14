import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, IconButton, Paper, Stack, TextField, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteGalleryEntry, renameGalleryEntry } from '../../globals/database';
import { download, downloadJSON } from '../../globals/utils';
import { canvasParameters } from '../../constants';
import OrganismCanvas from '../Canvases/OrganismCanvas';
import TargetCanvas from '../Canvases/TargetCanvas';
import { GalleryEntryType } from '../../types';

const width = canvasParameters.width / 2;
const height = canvasParameters.height / 2;

function GalleryEntry({ data, readOnly }) {
  const {
    json,
    id,
    name,
    simulationId,
  } = data;
  const {
    gif,
    globalBest,
    totalGen,
    parameters,
  } = JSON.parse(json);

  const [entryName, setEntryName] = useState(name);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const onDelete = () => {
    deleteGalleryEntry(id);
  };

  const onDownload = () => {
    download(name, gif);
    if (isDevelopment) {
      downloadJSON(name, data);
    }
  };

  const onChangeName = async (event) => {
    const { value } = event.target;
    setEntryName(value);
    // TODO: Throttle this update, same with SimulationEntry name change
    await renameGalleryEntry(id, value);
  };

  return (
    <Box sx={{ display: 'inline-block', m: 1 }}>
      <Stack direction="row" spacing={1}>
        <Stack spacing={1}>
          <OrganismCanvas organism={globalBest.organism} width={width} height={height} />
          <TargetCanvas width={width} height={height} target={parameters.population.target} />
        </Stack>
        <img src={gif} alt={`${name} gif`} />
      </Stack>
      <Paper elevation={2} sx={{ position: 'relative' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Stack>
            {!readOnly && (
              <Typography
                color="GrayText"
                fontSize="small"
                sx={{ position: 'absolute', top: '0.25rem', right: '0.5rem' }}
              >
                {simulationId}
              </Typography>
            )}
            <TextField
              value={entryName}
              onChange={onChangeName}
              variant="standard"
              sx={{ pb: 1 }}
              disabled={readOnly}
            />
            <Typography variant="body2">{`Top score: ${globalBest.organism.fitness.toFixed(3)}`}</Typography>
            <Typography variant="body2">{`Number of △: ${globalBest.organism.genome.chromosomes.length}`}</Typography>
            <Typography variant="body2">{`Generations: ${totalGen.toLocaleString()}`}</Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'end' }}>
            <IconButton onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
            <IconButton color="error" onClick={onDelete} disabled={readOnly}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

GalleryEntry.propTypes = {
  data: PropTypes.shape(GalleryEntryType).isRequired,
  readOnly: PropTypes.bool,
};

GalleryEntry.defaultProps = {
  readOnly: false,
};

export default GalleryEntry;
