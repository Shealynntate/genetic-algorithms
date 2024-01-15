export type AppState = 'none' | 'running' | 'paused' | 'complete'

export type AlertState = 'error' | 'info' | 'success' | 'warning'

export interface NavigationState {
  simulationState: AppState
  simulationGraphColors: Record<number, string>
  simulationGraphIndices: Record<number, number>
}
