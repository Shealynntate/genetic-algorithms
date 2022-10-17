import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
import GenerationSummary from './GenerationSummary';
import PopulationOverviewChart from './PopulationOverviewChart';
import { useIsRunning } from '../hooks';
import theme from '../theme';
import {
  resetSimulationState,
  setSimulationStateToComplete,
  setSimulationStateToPaused,
  setSimulationStateToRunning,
} from '../features/populationSlice';

function App() {
  const [population, setPopulation] = useState(null);
  const [generations, setGenerations] = useState([]);
  const target = useSelector((state) => state.target.value);
  const mutation = useSelector((state) => state.mutation.value);
  const populationSize = useSelector((state) => state.population.size);
  const isRunning = useIsRunning();
  const dispatch = useDispatch();
  const timeoutRef = useRef();

  const runGeneration = () => {
    const nextGen = population.runGeneration(mutation);
    setGenerations([...generations, nextGen]);
  };

  useEffect(() => {
    if (!population || population.isTargetReached()) {
      if (isRunning) {
        dispatch(setSimulationStateToComplete());
      }
      return;
    }

    timeoutRef.current = setTimeout(runGeneration, 3);
  }, [population, generations]);

  const onRun = () => {
    dispatch(setSimulationStateToRunning());
    if (population) {
      // If we're resuming after a pause, continue the simulation
      timeoutRef.current = setTimeout(runGeneration, 3);
    } else {
      // Otherwise create a new population and start from the beginning
      const p = new Population(populationSize, target, mutation);
      setPopulation(p);
      setGenerations([p.organisms]);
    }
  };

  const onReset = () => {
    setPopulation(null);
    setGenerations([]);
    dispatch(resetSimulationState());
  };

  const onPause = () => {
    dispatch(setSimulationStateToPaused());
    clearTimeout(timeoutRef.current);
  };

  return (
    <div>
      <header>
        <Typography variant="h2">Genetic Algorithms</Typography>
      </header>
      <Grid container spacing={4} padding={theme.spacing(2)}>
        <Grid item xs={3}>
          <ControlPanel onRun={onRun} onReset={onReset} onPause={onPause} />
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ height: 400 }}>
            <ParentSize>
              {({ ref }) => (
                <PopulationOverviewChart
                  parentRef={ref}
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
