import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useGetGalleryEntries } from '../../globals/database';
import GalleryEntry from './GalleryEntry';
import DemoGallery from './DemoGallery';
import Panel from '../common/Panel';
import Keyword from '../common/Keyword';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];
  const hasEntries = entriesJSON.length > 0;

  return (
    <Paper>
      <Box pb={1.5}>
        <Typography variant="h4">Welcome</Typography>
        <Typography variant="subtitle1">
          Here are some results from running this site&apos;s Genetic Algorithm tool!
        </Typography>
        <Typography pt={1}>Wanna try it yourself?</Typography>
        <Typography pl={2} color="GrayText">
          Check out the
          <Keyword>Simulations</Keyword>
          tab and come back here to see the final results!
        </Typography>
        <Typography pt={1}>Wanna know what this is all about?</Typography>
        <Typography pl={2} color="GrayText">
          Check out the
          <Keyword>About</Keyword>
          tab for info, resources, and a link to the Github
        </Typography>
      </Box>
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
