export type AppState = 'none' | 'running' | 'paused' | 'complete'

export type AlertState = 'error' | 'info' | 'success' | 'warning'

export interface NavigationState {
  simulationState: AppState
  showCreateSimulationModal: boolean
  simulationGraphColors: Record<number, string>
  simulationGraphIndices: Record<number, number>
}

export interface MousePosition {
  x: number
  y: number
}
