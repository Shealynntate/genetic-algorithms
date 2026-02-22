export type Page = 'home' | 'gallery' | 'experiment' | 'yourArt' | 'github' | 'admin'

export type AppState = 'none' | 'running' | 'paused' | 'complete'

export type AlertState = 'error' | 'info' | 'success' | 'warning'

export interface NavigationState {
  simulationState: AppState
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
