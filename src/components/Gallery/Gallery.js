import React from 'react';
import { Paper } from '@mui/material';
import { useGetGalleryEntries } from '../../globals/database';
import GalleryEntry from './GalleryEntry';
import DemoGallery from './DemoGallery';
import Panel from '../settingsPanels/Panel';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];
  const hasEntries = entriesJSON.length > 0;

  return (
    <Paper>
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
      <DemoGallery />
    </Paper>
  );
}

export default Gallery;
