import React from 'react';
import { Container, Stack } from '@mui/material';
import ControlPanel from './ControlPanel';
import Header from './Header';
import DisplayTabs from './DisplayTabs';

function App() {
  return (
    <div>
      <Header />
      <Container>
        <Stack spacing={1} direction="row">
          <ControlPanel />
          <DisplayTabs />
        </Stack>
      </Container>
    </div>
  );
}

export default App;
