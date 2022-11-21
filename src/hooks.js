import { useSelector } from 'react-redux';
import { SimulationState } from './constants';
import { createImageData } from './utils';

export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.RUNNING;
};

export const useIsComplete = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.COMPLETE;
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
