import React from 'react';
import { Paper } from '@mui/material';
// import testData from '../../assets/test-gallery-file.json';
import { useGetGalleryEntries } from '../../globals/database';
import GalleryEntry from '../GalleryEntry';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];

  return (
    <Paper>
      {/* <GalleryEntry
        id={0}
        data={testData}
      /> */}
      {entriesJSON.map(({
        id,
        json,
        name,
        simulationId,
      }) => (
        <GalleryEntry
          key={id}
          id={id}
          json={json}
          name={name}
          simulationId={simulationId}
        />
      ))}
    </Paper>
  );
}

export default Gallery;
