import React from 'react';
import { Paper } from '@mui/material';
import compositionII from '../../assets/gallery-entries/composition_II.json';
import { useGetGalleryEntries } from '../../globals/database';
import GalleryEntry from '../GalleryEntry';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];

  return (
    <Paper>
      <GalleryEntry data={compositionII} />
      {entriesJSON.map((data) => (
        <GalleryEntry
          key={data.id}
          data={data}
        />
      ))}
    </Paper>
  );
}

export default Gallery;
