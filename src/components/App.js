import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
} from '@mui/material';
import Header from './Header';
import TabPanel from './common/TabPanel';
import Gallery from './gallery/Gallery';
import Progress from './progress/Progress';
import Simulations from './simulations/Simulations';
import About from './about/About';

function App() {
  const [value, setValue] = useState(0);

  const onChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header />
      <Container>
        <Box>
          <Box>
            <Tabs onChange={onChange} value={value}>
              <Tab label="Gallery" />
              <Tab label="Simulations" />
              <Tab label="Progress Snapshots" />
              <Tab label="About" />
            </Tabs>
          </Box>
          <TabPanel index={0} value={value}>
            <Gallery />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <Simulations />
          </TabPanel>
          <TabPanel index={2} value={value}>
            <Progress />
          </TabPanel>
          <TabPanel index={3} value={value}>
            <About />
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
}

export default App;
