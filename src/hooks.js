import { useSelector } from 'react-redux';
import { SimulationState } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.population.simulationState);
  return simulationState === SimulationState.RUNNING;
};
