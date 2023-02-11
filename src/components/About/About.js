import React from 'react';
import { Link, Paper, Typography } from '@mui/material';
import ResourcesPanel from './ResourcesPanel';
import OverviewPanel from './OverviewPanel';
import AlgorithmPanel from './AlgorithmPanel';
import ProjectPanel from './ProjectPanel';
import Introduction from './Introduction';

function About() {
  return (
    <Paper>
      <Typography color="GrayText" sx={{ display: 'inline-block', pr: 1, pb: 1 }}>
        Full credit to Robert Johansson for this project idea. Check it out at
      </Typography>
      <Link
        href="https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/"
        underline="hover"
        sx={{ display: 'inline-block' }}
      >
        Genetic Programming: Evolution of the Mona Lisa
      </Link>
      <Introduction />
      <OverviewPanel />
      <AlgorithmPanel />
      <ProjectPanel />
      <ResourcesPanel />
    </Paper>
  );
}

export default About;
