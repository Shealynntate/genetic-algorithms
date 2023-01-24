import { useSelector } from 'react-redux';
import {
  PausedStates,
  RunningStates,
  SaveAppStates,
  SettingsDisabledStates,
  AppState,
  defaultLineColor,
  getGraphColor,
} from './constants';

export const useIsRunning = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return RunningStates.includes(simulationState);
};

export const useIsComplete = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === AppState.COMPLETE;
};

export const useIsPaused = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === AppState.PAUSED;
};

export const useDisableSettings = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return SettingsDisabledStates.includes(simulationState);
};

const currentStateSelector = ({ ux }) => (ux.simulationState);

export const isRunningSelector = (state) => (
  RunningStates.includes(currentStateSelector(state))
);

export const isPausedSelector = (state) => (
  PausedStates.includes(currentStateSelector(state))
);

export const useDisableSaveSimulation = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return !SaveAppStates.includes(simulationState);
};

export const useIsGraphEntry = (id) => {
  const entries = useSelector((state) => state.ux.simulationGraphEntries);
  return (id in entries);
};

export const useGraphColor = (id) => {
  const isEntry = useIsGraphEntry(id);
  const entries = useSelector((state) => state.ux.simulationGraphEntries);
  if (!isEntry) return defaultLineColor;

  return getGraphColor(entries[id]);
};
