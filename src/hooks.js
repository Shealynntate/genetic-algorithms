import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  PausedStates,
  RunningStates,
  SaveAppStates,
  SettingsDisabledStates,
  AppState,
  defaultLineColor,
} from './constants';
import { useGetCompletedSimulations, useGetCurrentSimulation } from './globals/database';

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
  const entries = useSelector((state) => state.ux.simulationGraphColors);
  return (id in entries);
};

export const useGraphColor = (id) => {
  const isEntry = useIsGraphEntry(id);
  const entries = useSelector((state) => state.ux.simulationGraphColors);
  if (!isEntry) return defaultLineColor;

  return entries[id];
};

export const useGetGraphSimulations = () => {
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  const runningStats = useSelector((state) => state.simulation.runningStatsRecord);
  const completedSims = useGetCompletedSimulations() || [];
  const currentSim = useGetCurrentSimulation();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keys = Object.keys(graphEntries).map((k) => parseInt(k, 10));
    const entries = completedSims.filter(({ id }) => keys.includes(id));
    if (keys.includes(currentSim?.id)) {
      entries.push({ ...currentSim, results: runningStats });
    }
    setSimulations(entries);
    setLoading(false);
  }, [graphEntries]);

  return { simulations, loading };
};
