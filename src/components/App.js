import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
import GenerationSummary from './GenerationSummary';
import PopulationOverviewChart from './PopulationOverviewChart';
import theme from '../theme';

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
      setGenerations([...generations, oldGen]);
    }, 5);
    counter.current += 1;
    // console.log('Target reached!');
    // console.log(population.organisms[0]);
  }, [population, generations]);

  const onRun = (populationSize, mutationRate) => {
    const p = new Population(populationSize, 'hello', mutationRate);
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
      <Grid container spacing={4} padding={theme.spacing(2)}>
        <Grid item xs={4}>
          <ControlPanel onRun={onRun} onReset={onReset} />
        </Grid>
        <Grid item xs={8}>
          <ParentSize style={{ height: 500 }}>
            {({ width, height }) => (
              <PopulationOverviewChart
                width={width}
                height={height}
                generations={generations}
                maxFitness={5}
              />
            )}
          </ParentSize>
        </Grid>
      </Grid>
      {generations.map((gen) => (
        <GenerationSummary organisms={gen} key={gen[0].id} />
      ))}
    </div>
  );
}

export default App;
