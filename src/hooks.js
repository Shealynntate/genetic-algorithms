import { useSelector } from 'react-redux';
import { useLiveQuery } from 'dexie-react-hooks';
import { SimulationState } from './constants';
import { createImageData } from './globals/utils';
import database from './globals/database';

export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.RUNNING;
};

export const useIsComplete = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.COMPLETE;
};

export const useIsPaused = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.PAUSED;
};

export const useMaxFitness = () => {
  const target = useSelector((state) => state.metadata.target);
  return target.length;
};

export const useTargetData = async () => {
  const target = useSelector((state) => state.metadata.target);
  const { data } = await createImageData(target);

  return data;
};

const currentStateSelector = ({ ux }) => (ux.simulationState);

export const isRunningSelector = (state) => (
  currentStateSelector(state) === SimulationState.RUNNING
);

export const useImageDbQuery = () => (
  useLiveQuery(() => database.images.toArray())
);
