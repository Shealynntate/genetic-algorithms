export type Page = 'gallery' | 'experiment' | 'yourArt'

export type AppState = 'none' | 'running' | 'paused' | 'complete'

export type AlertState = 'error' | 'info' | 'success' | 'warning'

export interface NavigationState {
  simulationState: AppState
  showCreateSimulationModal: boolean
  simulationGraphColors: Record<number, string>
  simulationGraphIndices: Record<number, number>
  isAuthenticated: boolean
  errorSnackbarOpen: boolean
  successSnackbarOpen: boolean
  errorSnackbarMessage: string
  successSnackbarMessage: string
}

export interface MousePosition {
  x: number
  y: number
}
