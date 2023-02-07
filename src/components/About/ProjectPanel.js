import React from 'react';
import { Typography } from '@mui/material';
import Panel from '../settingsPanels/Panel';
// import ExampleText from './ExampleText';
import Keyword from './Keyword';
import SectionTitle from './SectionTitle';

function ProjectPanel() {
  return (
    <Panel label="This Project">
      <SectionTitle>The Content</SectionTitle>
      <Typography>
        This site is an interactive demo of Genetic Algorithms, try it out!
        You can set up runs with a custom target image and play with the tuning of the
        hyperparameters to see the results.
        The site stores previous runs to allow you to compare performances.
        You can also view Gifs and final images of your runs in the
        <Keyword>Gallery</Keyword>
        tab.
      </Typography>
      <SectionTitle>The Site</SectionTitle>
      <Typography>
        This site is made with React via create-react-app.
        It also uses Redux and React Sagas for state management and site logic.
        Everything is done client-side.
        Data from previous and pending runs is stored in IndexedDB using Dexie.
        You can check out the source code for everything on Github.
      </Typography>
    </Panel>
  );
}

export default ProjectPanel;
