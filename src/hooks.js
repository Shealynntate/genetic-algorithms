import { useSelector } from 'react-redux';
import { SimulationState } from './constants';
import { createImageData } from './globals/utils';
import { getCurrentStats } from './globals/database';

const SettingsDisabledStates = [
  SimulationState.RUNNING,
  SimulationState.RUNNING_EXPERIMENTS,
  SimulationState.PAUSED,
  SimulationState.COMPLETE,
  SimulationState.COMPLETE_EXPERIMENTS,
];

const SaveSimulationStates = [
  SimulationState.PAUSED,
  SimulationState.COMPLETE,
];

const ExperimentationStates = [
  SimulationState.RUNNING_EXPERIMENTS,
  SimulationState.PAUSED_EXPERIMENTS,
  SimulationState.COMPLETE_EXPERIMENTS,
];

const RunningStates = [
  SimulationState.RUNNING,
  SimulationState.RUNNING_EXPERIMENTS,
];

export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return RunningStates.includes(simulationState);
};

export const useIsComplete = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.COMPLETE;
};

export const useIsPaused = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === SimulationState.PAUSED;
};

export const useDisableSettings = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return SettingsDisabledStates.includes(simulationState);
};

export const useMaxFitness = () => {
  const target = useSelector((state) => state.parameters.target);
  return target.length;
};

export const useCurrentStats = async () => {
  const stats = await getCurrentStats();
  return stats.length ? stats[stats.length - 1] : {};
};

export const useTargetData = async () => {
  const target = useSelector((state) => state.parameters.target);
  const { data } = await createImageData(target);

  return data;
};

export const useInExperimentationMode = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return ExperimentationStates.includes(simulationState);
};

const currentStateSelector = ({ ux }) => (ux.simulationState);

export const isRunningSelector = (state) => (
  RunningStates.includes(currentStateSelector(state))
);

export const isExperimentationModeSelector = (state) => (
  ExperimentationStates.includes(currentStateSelector(state))
);

export const useDisableSaveSimulation = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return !SaveSimulationStates.includes(simulationState);
};
