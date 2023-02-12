import React from 'react';
import { Link, Stack, Typography } from '@mui/material';
import Panel from '../settingsPanels/Panel';
import Keyword from './Keyword';
import SectionTitle from './SectionTitle';

function Introduction() {
  return (
    <Panel label="Introduction" px={2}>
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
          <Typography pb={1}>
            The graph on the right tracks a population&apos;s fitness over time and allows you
            to compare multiple runs.
          </Typography>
          <Typography pb={1}>
            The
            <Keyword>Progress Snapshots</Keyword>
            tab lets you view live statistics and image snapshots of the current run.
            It can be a useful way to get a sense of how a run is performing.
          </Typography>
          <Typography>
            Once a run is completed, check out the
            <Keyword>Gallery</Keyword>
            tab where you can view its final image and a gif timelapse.
            There are some example runs in there as well.
          </Typography>
        </Stack>
      </Stack>
      <Typography
        color="GrayText"
        sx={{
          display: 'inline-block', pt: 1, pr: 1, pb: 1,
        }}
      >
        Full credit to Robert Johansson for this project idea. Check it out at
      </Typography>
      <Link
        href="https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/"
        underline="hover"
        sx={{ display: 'inline-block' }}
      >
        Genetic Programming: Evolution of the Mona Lisa
      </Link>
    </Panel>
  );
}

export default Introduction;
