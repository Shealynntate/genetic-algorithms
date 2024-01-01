import React from 'react';
import { Box } from '@mui/material';
import { useGetGalleryEntries } from '../../global/database';
import GalleryEntry from './GalleryEntry';
import DemoGallery from './DemoGallery';
import Panel from '../common/Panel';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];
  const hasEntries = entriesJSON.length > 0;

  return (
    <Box>
      <DemoGallery />
      {hasEntries && (
        <Panel label="Your Work">
          {entriesJSON.map((data) => (
            <GalleryEntry
              key={data.id}
              data={data}
            />
          ))}
        </Panel>
      )}
    </Box>
  );
}

export default Gallery;
