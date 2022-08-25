import { Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
import GenerationSummary from './GenerationSummary';

function App() {
  const [population, setPopulation] = useState(null);
  const [generations, setGenerations] = useState([]);
  const counter = useRef(0);

  useEffect(() => {
    if (!population || population.isTargetReached()) return;
    if (counter.current > 1000) {
      console.log('saftey counter tripped');
      return;
    }
    const oldGen = population.runGeneration();
    console.log('top score', oldGen[0].fitness);
    setTimeout(() => {
      setGenerations([oldGen, ...generations]);
    }, 10);
    counter.current += 1;
    // console.log('Target reached!');
    // console.log(population.organisms[0]);
  }, [population, generations]);

  const onRun = (populationSize, mutationRate) => {
    const p = new Population(populationSize, 'hello friend', mutationRate);
    setPopulation(p);
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
      {generations.map((gen) => (
        <GenerationSummary organisms={gen} key={gen[0].id} />
      ))}
    </div>
  );
}

export default App;
