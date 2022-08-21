import { Typography } from '@mui/material';
import React from 'react';
import ControlPanel from './ControlPanel';

function App() {
  const onRun = (populationSize, mutationRate) => {
    console.log('run', { populationSize, mutationRate });
  };

  const onReset = () => {
    console.log('reset');
  };

  return (
    <div>
      <header>
        <Typography variant="h1">Genetic Algorithms</Typography>
      </header>
      <ControlPanel onRun={onRun} onReset={onReset} />
    </div>
  );
}

export default App;
