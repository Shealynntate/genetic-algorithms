import React from 'react';
import {
  Box, Paper, Stack, Typography,
} from '@mui/material';
import { useGetGalleryEntries } from '../../global/database';
import GalleryEntry from './GalleryEntry';
import DemoGallery from './DemoGallery';
import Panel from '../common/Panel';
import Keyword from '../common/Keyword';

function Gallery() {
  const entriesJSON = useGetGalleryEntries() || [];
  const hasEntries = entriesJSON.length > 0;

  return (
    <Paper>
      <Paper elevation={4} sx={{ mb: 1.5, textAlign: 'center' }}>
        <Typography variant="h4">Welcome!</Typography>
        <Typography variant="subtitle1" color="GrayText">
          Here you&apos;ll find results from running this site&apos;s Genetic Algorithm tool
        </Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-evenly' }}>
          <Box sx={{ maxWidth: 350 }}>
            <Typography pt={1}>Wanna try it yourself?</Typography>
            <Typography color="GrayText">
              Check out the
              <Keyword>Simulations</Keyword>
              tab and come back here to see the final results!
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 350 }}>
            <Typography pt={1}>Wanna know what this is all about?</Typography>
            <Typography color="GrayText">
              Check out the
              <Keyword>About</Keyword>
              tab for info, resources, and a link to the Github
            </Typography>
          </Box>
        </Stack>
      </Paper>
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
