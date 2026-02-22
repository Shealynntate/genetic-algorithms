import { useSelector } from 'react-redux'

import { type RootState } from '../store'
import { type OrganismRecord } from './types'
import { useGetCurrentSimulation } from '../database/hooks'
import { type Simulation } from '../database/types'

export const useCreateRunningSimulation = (): Simulation | undefined => {
  const dbSimulation = useGetCurrentSimulation()
  const globalBest = useSelector(
    (state: RootState) => state.simulation.globalBest
  )
  const currentGenStats = useSelector(
    (state: RootState) => state.simulation.currentGenStats
  )
  // const dbReport = useGetCurrentSimulationReport()
  if (dbSimulation == null) {
    return undefined
  }
  const defaultPopulation = dbSimulation.population!
  const simulation: Simulation = {
    ...dbSimulation,
    population: {
      ...defaultPopulation,
      best: globalBest ?? (dbSimulation.population?.best as OrganismRecord),
      genId: currentGenStats?.stats.gen ?? dbSimulation.population!.genId
    }
  }
  return simulation
}
