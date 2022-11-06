import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
import OverviewChart from './overviewChart/OverviewChart';
import { useIsRunning } from '../hooks';
import theme from '../theme';
import {
  resetSimulationState,
  setSimulationStateToComplete,
  setSimulationStateToPaused,
  setSimulationStateToRunning,
} from '../features/uxSlice';
import SimulationStatusPanel from './SimulationStatusPanel';
import GenealogyVisualization from './genealogyTree/GenealogyVisualization';
import { generateTree } from '../models/utils';

function App() {
  const [population, setPopulation] = useState(null);
  const [generations, setGenerations] = useState([]);
  const target = useSelector((state) => state.metadata.target);
  const mutation = useSelector((state) => state.metadata.mutationRate);
  const populationSize = useSelector((state) => state.metadata.populationSize);
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
      p.evaluateFitness();
      setGenerations([p.createGenNode()]);
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

  const tree = generateTree(generations);

  return (
    <div>
      <header>
        <Typography variant="h4">Genetic Algorithms</Typography>
      </header>
      <Grid container spacing={theme.spacing(2)} padding={theme.spacing(2)}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ControlPanel onRun={onRun} onReset={onReset} onPause={onPause} />
            <SimulationStatusPanel
              genCount={generations.length}
              currentGen={generations[generations.length - 1]}
            />
          </Box>
          <Paper sx={{ height: 400 }}>
            <ParentSize>
              {({ ref }) => (
                <OverviewChart
                  parentRef={ref}
                  tree={tree}
                  targetFitness={target.length}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <GenealogyVisualization
            tree={tree}
            maxFitness={target.length}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
