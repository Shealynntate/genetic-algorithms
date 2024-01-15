import React from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import { useGetCurrentSimulation } from '../database/hooks'
import SimulationGraphEntry from '../graph/SimulatonGraphEntry'

interface RunningSimulationGraphProps {
  xScale: (value: number) => number
  yScale: (value: number) => number
  graphHeight: number
}

function RunningSimulationGraph ({
  xScale,
  yScale,
  graphHeight
}: RunningSimulationGraphProps): JSX.Element | null {
  const runningStats = useSelector((state: RootState) => state.simulation.runningStatsRecord)
  const graphEntries = useSelector((state: RootState) => state.navigation.simulationGraphColors)
  const currentSim = useGetCurrentSimulation()

  if (currentSim?.id == null) {
    return null
  }

  return (
    <SimulationGraphEntry
      color={graphEntries[currentSim.id]}
      data={runningStats}
      id={currentSim.id}
      graphHeight={graphHeight}
      xScale={xScale}
      yScale={yScale}
    />
  )
}

export default RunningSimulationGraph
