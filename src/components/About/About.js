import React from 'react';
import { Paper } from '@mui/material';
import ResourcesPanel from './ResourcesPanel';
import OverviewPanel from './OverviewPanel';
import AlgorithmPanel from './AlgorithmPanel';
import ProjectPanel from './ProjectPanel';
import Introduction from './Introduction';

function About() {
  return (
    <Paper>
      <Introduction />
      <OverviewPanel />
      <AlgorithmPanel />
      <ProjectPanel />
      <ResourcesPanel />
    </Paper>
  );
}

export default About;
