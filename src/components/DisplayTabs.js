import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import TabPanel from './TabPanel';
import GenealogyVisualization from './genealogyTree/GenealogyVisualization';
import SimulationStatusPanel from './SimulationStatusPanel';

function DisplayTabs() {
  const [value, setValue] = useState(0);

  const onChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs onChange={onChange} value={value}>
          <Tab label="Images" />
          <Tab label="Genealogy" />
        </Tabs>
      </Box>
      <TabPanel index={0} value={value}>
        <SimulationStatusPanel />
      </TabPanel>
      <TabPanel index={1} value={value}>
        <GenealogyVisualization />
      </TabPanel>
    </Box>
  );
}

export default DisplayTabs;
