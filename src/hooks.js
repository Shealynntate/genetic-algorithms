import { useSelector } from 'react-redux';
import { SimulationState } from './constants';

export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.RUNNING;
};

export const useMaxFitness = () => {
  const target = useSelector((state) => state.metadata.target);
  return target.length;
};
