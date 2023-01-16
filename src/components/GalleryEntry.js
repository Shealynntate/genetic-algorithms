import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, IconButton, Paper, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteGalleryEntry } from '../globals/database';

function GalleryEntry({ id, data }) {
  // console.log(data);
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

  return (
    <Box sx={{ display: 'inline-block' }}>
      <img src={gif} alt={`${name} gif`} />
      <Paper elevation={2}>
        <Typography>{name}</Typography>
        <Typography>{`Top score ${globalBest.organism.fitness}`}</Typography>
        <Typography>{`Total generations ${totalGen}`}</Typography>
      </Paper>
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
