import React from 'react';
// import { Typography } from '@mui/material';
import Panel from '../settingsPanels/Panel';
// import ExampleText from './ExampleText';
// import Keyword from './Keyword';
// import SectionTitle from './SectionTitle';

function ProjectPanel() {
  return (
    <Panel label="This Site">
      This site is an interative tool that lets you change parameters for a Genetic Algorithm
      and run that simulation. It lets you watch the top organisms evolve over time and track
      the population&apos;s fitness graphically. Previous runs are also stored for comparison.
      Completed runs also generate a timelapse gif of the process that you can find on the
      Gallery tab,
    </Panel>
  );
}

// This site is an interactive tool that lets you generate runs of the Genetic Algorithm
// Tweak hyperparameters and compare the results of their performance graphically by tracking
// fitness metrics over the generations of a run

export default ProjectPanel;
