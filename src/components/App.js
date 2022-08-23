import { Typography } from '@mui/material';
import React, { useState } from 'react';
import Population from '../models/population';
import ControlPanel from './ControlPanel';

function App() {
  const [population, setPopulation] = useState(null);

  const onRun = (populationSize, mutationRate) => {
    const p = new Population('hello friend', populationSize);
    setPopulation(p);

    while (!p.isTargetReached()) {
      const oldGen = p.runGeneration(mutationRate);
      // console.log(oldGen[0]);
      console.log('top score', oldGen[0].fitness);
    }
    console.log('Target reached!');
    console.log(p.organisms[0]);
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
      {population && population.organismsByFitness().map((o) => o.ToString())}
    </div>
  );
}

export default App;
