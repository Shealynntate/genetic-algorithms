import React, { useState } from 'react';
import {
  Box, Paper, Tab, Tabs,
} from '@mui/material';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import TabPanel from './TabPanel';
import GalleryPanel from './GalleryPanel';
import ProgressPanel from './ProgressPanel';
import StatsPanel from './StatsPanel';

function DisplayTabs() {
  const [value, setValue] = useState(0);

  const onChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs onChange={onChange} value={value}>
          <Tab label="Progress" />
          <Tab label="Stats" />
          <Tab label="Gallery" />
        </Tabs>
      </Box>
      <TabPanel index={0} value={value}>
        <ProgressPanel />
      </TabPanel>
      <TabPanel index={1} value={value}>
        <Paper sx={{ height: '400px', width: '550px', boxSizing: 'border-box' }}>
          <ParentSize>
            {({ width, height }) => (
              <StatsPanel
                width={width}
                height={height}
              />
            )}
          </ParentSize>
        </Paper>
        <StatsPanel />
      </TabPanel>
      <TabPanel index={2} value={value}>
        <GalleryPanel />
      </TabPanel>
    </Box>
  );
}

export default DisplayTabs;
