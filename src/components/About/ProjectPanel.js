import React from 'react';
import { Typography } from '@mui/material';
import Panel from '../settingsPanels/Panel';
// import ExampleText from './ExampleText';
// import Keyword from './Keyword';
import SectionTitle from './SectionTitle';

function ProjectPanel() {
  return (
    <Panel label="This Project">
      <SectionTitle>Things I&apos;ve Learned</SectionTitle>
      <Typography>
        Plateaus - Most images of any complexity seem to experience a fitness plateau around the 97%
        mark. I tried so many things to avoid the plateau and all of them just made things worse
        - Split population (species) with merging events
        - Distruption Events if stagnation was detected
        - Mitosis mechanism - here I thought I was being clever... I was not. The net result was a
        really noisy mean fitness in the population
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
