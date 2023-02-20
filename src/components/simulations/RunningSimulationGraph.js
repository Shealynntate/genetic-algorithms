import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useGetCurrentSimulation } from '../../globals/database';
import Line from '../Charts/Line';
import DeviationLine from '../Charts/DeviationLine';

function RunningSimulationGraph({
  xScale,
  yScale,
  showMean,
  showMin,
  showDeviation,
  graphHeight,
}) {
  const runningStats = useSelector((state) => state.simulation.runningStatsRecord);
  const graphEntries = useSelector((state) => state.ux.simulationGraphColors);
  const currentSim = useGetCurrentSimulation();

  if (!currentSim) return null;

  return (
    <>
      {showMean && (
        <Line
          data={runningStats}
          x={({ stats }) => xScale(stats.genId)}
          y={({ stats }) => yScale(stats.meanFitness)}
          color={graphEntries[currentSim.id]}
          type="dashed"
          width={0.8}
        />
      )}
      {showDeviation && (
        <DeviationLine
          id={currentSim.id}
          data={runningStats}
          color={graphEntries[currentSim.id]}
          xScale={xScale}
          yScale={yScale}
          yMax={graphHeight}
        />
      )}
      {showMin && (
        <Line
          data={runningStats}
          x={({ stats }) => xScale(stats.genId)}
          y={({ stats }) => yScale(stats.minFitness)}
          color={graphEntries[currentSim.id]}
          width={0.4}
        />
      )}
      <Line
        data={runningStats}
        x={({ stats }) => xScale(stats.genId)}
        y={({ stats }) => yScale(stats.maxFitness)}
        width={1}
        color={graphEntries[currentSim.id]}
      />
    </>
  );
}

RunningSimulationGraph.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  showMean: PropTypes.bool.isRequired,
  showMin: PropTypes.bool.isRequired,
  showDeviation: PropTypes.bool.isRequired,
  graphHeight: PropTypes.number.isRequired,
};

export default RunningSimulationGraph;
