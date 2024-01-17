import { type RootState } from '../store'
import { type OrganismRecord } from './types'
import { type Population } from '../population/types'
import { type Simulation } from '../database/types'
import { useSelector } from 'react-redux'
import { useGetCurrentSimulation } from '../database/hooks'

export const useCreateRunningSimulation = (): Simulation | undefined => {
  const dbSimulation = useGetCurrentSimulation()
  const globalBest = useSelector((state: RootState) => state.simulation.globalBest)
  const currentGenStats = useSelector((state: RootState) => state.simulation.currentGenStats)
  // const dbReport = useGetCurrentSimulationReport()
  if (dbSimulation == null) {
    return undefined
  }
  const defaultPopulation = dbSimulation.population as Population
  const simulation: Simulation = {
    ...dbSimulation,
    population: {
      ...defaultPopulation,
      best: globalBest ?? dbSimulation.population?.best as OrganismRecord,
      genId: currentGenStats?.stats.gen ?? dbSimulation.population?.genId as number
    }
  }
  return simulation
}
