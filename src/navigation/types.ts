export type AppState = 'none' | 'running' | 'paused' | 'complete'

export interface NavigationState {
  simulationState: AppState
  simulationGraphColors: Map<number, string>
  simulationGraphIndices: Map<number, number>
}
