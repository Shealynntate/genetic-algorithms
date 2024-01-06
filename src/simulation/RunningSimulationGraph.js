import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useGetCurrentSimulation } from '../database/database';
import SimulationGraphEntry from '../components/graph/SimulatonGraphEntry';

function RunningSimulationGraph({
  xScale,
  yScale,
  graphHeight,
}) {
  const runningStats = useSelector((state) => state.simulation.runningStatsRecord);
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  const currentSim = useGetCurrentSimulation();

  if (!currentSim) return null;

  return (
    <SimulationGraphEntry
      color={graphEntries[currentSim.id]}
      data={runningStats}
      id={currentSim.id}
      graphHeight={graphHeight}
      xScale={xScale}
      yScale={yScale}
    />
  );
}

RunningSimulationGraph.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  graphHeight: PropTypes.number.isRequired,
};

export default RunningSimulationGraph;
