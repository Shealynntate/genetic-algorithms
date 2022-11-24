import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  // Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
// import OverviewChart from './overviewChart/OverviewChart';
import { useIsRunning } from '../hooks';
import theme from '../theme';
import {
  resetSimulation,
  pauseSimulation,
  runSimulation,
} from '../features/ux/uxSlice';
import SimulationStatusPanel from './SimulationStatusPanel';
// import GenealogyVisualization from './genealogyTree/GenealogyVisualization';
import { createImageData, generateTreeLayer } from '../globals/utils';
import RandomNoise from '../globals/randomNoise';
import { setCurrentGen, setMutationRate } from '../features/metadata/metadataSlice';
import Header from './Header';

const runDelay = 0;

function App() {
  const [population, setPopulation] = useState(null);
  const [tree, setTree] = useState([]);
  const target = useSelector((state) => state.metadata.target);
  const mutation = useSelector((state) => state.metadata.mutationRate);
  const populationSize = useSelector((state) => state.metadata.populationSize);
  const triangleCount = useSelector((state) => state.metadata.triangleCount);
  const currentGen = useSelector((state) => state.metadata.currentGen);
  const isRunning = useIsRunning();
  const dispatch = useDispatch();
  const timeoutRef = useRef();
  const imageDataRef = useRef();
  const varianceRef = useRef([]);

  const updateTree = (nextGen) => {
    // const treeCopy = tree.slice();
    const treeCopy = tree.slice(tree.length - 1);
    if (treeCopy.length > 1) {
      treeCopy[treeCopy.length - 1] = generateTreeLayer([currentGen, nextGen], 0);
    }
    const newLayer = generateTreeLayer([currentGen, nextGen], 1);

    varianceRef.current.push(newLayer.deviation);

    treeCopy.push(newLayer);
    setTree(treeCopy);
  };

  const runGeneration = () => {
    const nextGen = population.runGeneration(new RandomNoise(mutation));
    updateTree(nextGen);
    dispatch(setCurrentGen(population.createGenNode()));

    let total = 0;
    const count = varianceRef.current.length;
    const start = Math.max(0, count - 5);
    const end = Math.min(count - 1, start + 5);
    for (let i = start; i <= end; ++i) {
      total += varianceRef.current[i];
    }
    const avg = total / 5;
    if (avg < 0.008) {
      const rate = Math.min(1, mutation + 0.0025);
      console.log('Deviation too low, increasing mutation rate to ', rate);
      dispatch(setMutationRate(rate));
    } else if (avg > 0.05) {
      const rate = Math.max(0, mutation - 0.0025);
      console.log('Deviation too high, decreating mutation rate to ', rate);
      dispatch(setMutationRate(rate));
    }
  };

  useEffect(() => {
    if (!population) {
      return;
    }
    if (isRunning) {
      timeoutRef.current = setTimeout(runGeneration, runDelay);
    }
  }, [population, tree]);

  useEffect(() => {
    const setImageData = async () => {
      const { data } = await createImageData(target);
      imageDataRef.current = data;
    };
    if (target) {
      setImageData();
    }
  }, [target]);

  const onRun = () => {
    dispatch(runSimulation());
    if (population) {
      // If we're resuming after a pause, continue the simulation
      timeoutRef.current = setTimeout(runGeneration, runDelay);
    } else {
      // Otherwise create a new population and start from the beginning
      const p = new Population(populationSize, triangleCount, imageDataRef.current);
      p.evaluateFitness();
      setPopulation(p);
    }
  };

  const onReset = () => {
    setPopulation(null);
    setTree([]);
    dispatch(resetSimulation());
  };

  const onPause = () => {
    clearTimeout(timeoutRef.current);
    dispatch(pauseSimulation());
  };

  return (
    <div>
      <Header />
      <Grid container spacing={theme.spacing(2)} padding={theme.spacing(2)}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ControlPanel onRun={onRun} onReset={onReset} onPause={onPause} />
            <SimulationStatusPanel />
          </Box>
          {/* <Paper sx={{ height: 400 }}>
            <ParentSize>
              {({ ref }) => (
                <OverviewChart
                  parentRef={ref}
                  tree={tree}
                  targetFitness={1}
                />
              )}
            </ParentSize>
          </Paper> */}
        </Grid>
        <Grid item xs={6}>
          {/* <GenealogyVisualization
            tree={tree}
            maxFitness={0}
          /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
