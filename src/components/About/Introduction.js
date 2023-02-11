import React from 'react';
import { Stack, Typography } from '@mui/material';
import Panel from '../settingsPanels/Panel';
import Keyword from './Keyword';
import SectionTitle from './SectionTitle';

function Introduction() {
  return (
    <Panel label="Introduction">
      <Stack direction="row" spacing={2}>
        <Stack flex={1}>
          <SectionTitle>Welcome!</SectionTitle>
          <Typography>
            This is an interactive demo of Genetic Algorithms, try it out!
          </Typography>
          <Typography>
            Don&apos;t know what those are? No worries, check out
            the summary below and the
            <Keyword>Resource</Keyword>
            links at the bottom of this page.
          </Typography>
          <br />
          <Typography fontStyle="italic">
            TL;DR: We&apos;re trying to randomly &quot;evolve&quot;
            a bunch of polygons to look like the Mona Lisa.
            Think the Mona Lisa is overrated?
            Got you covered, just drag n&apos; drop any image to be a target!
          </Typography>
        </Stack>
        <Stack flex={1}>
          <SectionTitle>Site Tour</SectionTitle>
          <Typography>
            Most of the action is on the
            <Keyword>Simulations</Keyword>
            tab. There you can set up a new run, tweaking any of the parameters.
            Queue up as many simulations as you&apos;d like and hit
            <Keyword>Run</Keyword>
            to watch it go.
          </Typography>
          <Typography>
            You can set up runs with a custom target image and play with the tuning of the
            hyperparameters to see the results.
            The site stores previous runs to allow you to compare performances.
            You can also view Gifs and final images of your runs in the
            <Keyword>Gallery</Keyword>
            tab.
          </Typography>
        </Stack>
      </Stack>
    </Panel>
  );
}

export default Introduction;
