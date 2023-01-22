import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, IconButton, Paper, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteGalleryEntry } from '../globals/database';
import { download } from '../globals/utils';

function GalleryEntry({ id, data }) {
  console.log(data);
  const {
    gif, name, globalBest, totalGen,
  } = data;
  // Target image is under parameters.population.target:
  //  <Canvas width={width} height={height} imageData={imageData} />
  //
  // const [imageData, setImageData] = useState();
  //
  // useEffect(() => {
  //   let isMounted = true;
  //   const updateImage = async () => {
  //     const result = await createImageData(parameters.population.target);
  //     if (isMounted) {
  //       setImageData(result);
  //     }
  //   };
  //   updateImage();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [parameters.target]);

  const onDelete = () => {
    deleteGalleryEntry(id);
  };

  const onDownload = () => {
    download(name, gif);
  };

  return (
    <Box sx={{ display: 'inline-block', m: 1 }}>
      <img src={gif} alt={`${name} gif`} />
      <Paper elevation={2}>
        <Typography>{name}</Typography>
        <Typography variant="body2">{`Top score ${globalBest.organism.fitness.toFixed(3)}`}</Typography>
        <Typography variant="body2">{`Generations: ${totalGen}`}</Typography>
      </Paper>
      <IconButton onClick={onDownload}>
        <DownloadIcon />
      </IconButton>
      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

GalleryEntry.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.string.isRequired, // TODO
};

export default GalleryEntry;
