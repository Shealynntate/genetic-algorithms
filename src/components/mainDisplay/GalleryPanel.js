import React from 'react';
import { Paper } from '@mui/material';
import testData from '../../assets/test-gallery-file.json';
import { useGetGalleryEntries } from '../../globals/database';
import GalleryEntry from '../GalleryEntry';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];

  const entriesParsed = entriesJSON.map(({ id, createdOn, json }) => ({
    id,
    createdOn,
    data: JSON.parse(json),
  }));

  return (
    <Paper>
      <GalleryEntry id={0} data={testData} />
      {entriesParsed.map(({ id, data }) => (
        <GalleryEntry key={id} id={id} data={data} />
      ))}
    </Paper>
  );
}

export default Gallery;
