import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import TabPanel from './TabPanel';
import GalleryPanel from './GalleryPanel';
import ProgressPanel from './ProgressPanel';
import ExperimentationPanel from '../simulationPanel/SimulationPanel';
import About from '../About/About';

function DisplayTabs() {
  const [value, setValue] = useState(0);

  const onChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs onChange={onChange} value={value}>
          <Tab label="Simulations" />
          <Tab label="Progress Snapshots" />
          <Tab label="Gallery" />
          <Tab label="About" />
        </Tabs>
      </Box>
      <TabPanel index={0} value={value}>
        <ExperimentationPanel />
      </TabPanel>
      <TabPanel index={1} value={value}>
        <ProgressPanel />
      </TabPanel>
      <TabPanel index={2} value={value}>
        <GalleryPanel />
      </TabPanel>
      <TabPanel index={3} value={value}>
        <About />
      </TabPanel>
    </Box>
  );
}

export default DisplayTabs;
