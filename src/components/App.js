import {
  Box, Grid, Paper, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
import GenerationSummary from './GenerationSummary';
import PopulationOverviewChart from './PopulationOverviewChart';
import theme from '../theme';

function App() {
  const [population, setPopulation] = useState(null);
  const [generations, setGenerations] = useState([]);
  const target = useSelector((state) => state.target.value);
  const mutation = useSelector((state) => state.mutation.value);

  useEffect(() => {
    if (!population || population.isTargetReached()) return;

    setTimeout(() => {
      const nextGen = population.runGeneration(mutation);
      setGenerations([...generations, nextGen]);
    }, 3);
  }, [population, generations]);

  const onRun = (populationSize) => {
    const p = new Population(populationSize, target, mutation);
    setPopulation(p);
    setGenerations([p.organisms]);
  };

  const onReset = () => {
    console.log('reset');
  };

  return (
    <div>
      <header>
        <Typography variant="h2">Genetic Algorithms</Typography>
      </header>
      <Grid container spacing={4} padding={theme.spacing(2)}>
        <Grid item xs={4}>
          <ControlPanel onRun={onRun} onReset={onReset} />
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <ParentSize style={{ height: 400 }}>
              {({ width, height }) => (
                <PopulationOverviewChart
                  width={width}
                  height={height}
                  generations={generations}
                  targetFitness={target.length}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'scroll',
        }}
      >
        {generations.map((gen, index) => (
          <GenerationSummary
            key={gen[0].id}
            genNumber={index}
            organisms={gen}
            maxFitness={target.length}
          />
        ))}
      </Box>
    </div>
  );
}

export default App;
