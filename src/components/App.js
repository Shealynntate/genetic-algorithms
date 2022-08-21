import { Typography } from '@mui/material';
import React, { useState } from 'react';
import Population from '../models/population';
import ControlPanel from './ControlPanel';

function App() {
  const [population, setPopulation] = useState(null);

  const onRun = (populationSize, mutationRate) => {
    console.log('run', { populationSize, mutationRate });
    setPopulation(new Population('hello friend', populationSize));
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
      {population && population.organisms.map((o) => o.ToString())}
    </div>
  );
}

export default App;
