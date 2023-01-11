import React from 'react';
import { Container } from '@mui/material';
import Header from './Header';
import DisplayTabs from './mainDisplay/DisplayTabs';

function App() {
  return (
    <div>
      <Header />
      <Container>
        <DisplayTabs />
      </Container>
    </div>
  );
}

export default App;
