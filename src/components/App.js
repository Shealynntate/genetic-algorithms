import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  // Paper,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Population from '../models/population';
import ControlPanel from './ControlPanel';
// import OverviewChart from './overviewChart/OverviewChart';
import { useIsRunning } from '../hooks';
import theme from '../theme';
import {
  resetSimulationState,
  setSimulationStateToComplete,
  setSimulationStateToPaused,
  setSimulationStateToRunning,
} from '../features/uxSlice';
import SimulationStatusPanel from './SimulationStatusPanel';
// import GenealogyVisualization from './genealogyTree/GenealogyVisualization';
import { createImageData, generateTreeLayer } from '../utils';
import RandomNoise from '../globals/randomNoise';

const runDelay = 0;

function App() {
  const [population, setPopulation] = useState(null);
  const [currentGen, setCurrentGen] = useState();
  const [globalBest, setGlobalBest] = useState();
  const [tree, setTree] = useState([]);
  const target = useSelector((state) => state.metadata.target);
  const mutation = useSelector((state) => state.metadata.mutationRate);
  const populationSize = useSelector((state) => state.metadata.populationSize);
  const triangleCount = useSelector((state) => state.metadata.triangleCount);
  const isRunning = useIsRunning();
  const dispatch = useDispatch();
  const timeoutRef = useRef();
  const imageDataRef = useRef();

  const updateTree = (nextGen) => {
    // const treeCopy = tree.slice();
    const treeCopy = tree.slice(tree.length - 1);
    if (treeCopy.length > 1) {
      treeCopy[treeCopy.length - 1] = generateTreeLayer([currentGen, nextGen], 0);
    }
    const newLayer = generateTreeLayer([currentGen, nextGen], 1);
    treeCopy.push(newLayer);
    setTree(treeCopy);
    if (!globalBest || newLayer.maxFitOrganism.fitness > globalBest.organism.fitness) {
      setGlobalBest({
        id: nextGen.id,
        organism: newLayer.maxFitOrganism,
      });
    }
  };

  const runGeneration = () => {
    const nextGen = population.runGeneration(new RandomNoise(mutation));
    updateTree(nextGen);
    setCurrentGen(nextGen);
  };

  useEffect(() => {
    if (!population || population.isTargetReached()) {
      if (isRunning) {
        dispatch(setSimulationStateToComplete());
      }
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
    dispatch(setSimulationStateToRunning());
    if (population) {
      // If we're resuming after a pause, continue the simulation
      timeoutRef.current = setTimeout(runGeneration, runDelay);
    } else {
      // Otherwise create a new population and start from the beginning
      const p = new Population(populationSize, triangleCount, imageDataRef.current);
      p.evaluateFitness();
      setPopulation(p);
      setCurrentGen(p.createGenNode());
    }
  };

  const onReset = () => {
    setPopulation(null);
    setCurrentGen();
    setTree([]);
    dispatch(resetSimulationState());
  };

  const onPause = () => {
    clearTimeout(timeoutRef.current);
    dispatch(setSimulationStateToPaused());
  };

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
              currentGen={currentGen}
              globalBest={globalBest}
            />
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
