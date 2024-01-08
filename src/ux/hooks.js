import { useSelector } from 'react-redux';
import { AppState } from '../constants/typeDefinitions';
import { RunningStates } from '../constants/constants';

export const useIsPaused = () => {
  const simulationState = useSelector((state) => state.ux.simulationState);
  return simulationState === AppState.PAUSED;
};

const currentStateSelector = ({ ux }) => (ux.simulationState);

export const isRunningSelector = (state) => (
  RunningStates.includes(currentStateSelector(state))
);

export const useIsGraphEntry = (id) => {
  const entries = useSelector((state) => state.ux.simulationGraphColors);
  return (id in entries);
};

export const useGraphColor = (id) => {
  const isEntry = useIsGraphEntry(id);
  const entries = useSelector((state) => state.ux.simulationGraphColors);
  if (!isEntry) return null;

  return entries[id];
};
