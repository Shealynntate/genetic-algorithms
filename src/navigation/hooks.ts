import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import { type MousePosition, type AppState } from './types'
import { RunningStates } from '../constants/constants'
import { useEffect, useState } from 'react'

const currentStateSelector = ({ navigation }: RootState): AppState => (navigation.simulationState)

export const useIsPaused = (): boolean => {
  const simulationState = useSelector((state: RootState) => state.navigation.simulationState)
  return simulationState === 'paused'
}

export const isRunningSelector = (state: RootState): boolean => (
  RunningStates.includes(currentStateSelector(state))
)

export const useIsGraphEntry = (id: number): boolean => {
  const entries = useSelector((state: RootState) => state.navigation.simulationGraphColors)

  return (id in entries)
}

export const useGraphColor = (id: number): string | undefined => {
  const entries = useSelector((state: RootState) => state.navigation.simulationGraphColors)

  return entries[id]
}

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent): void => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])
  return mousePosition
}

export default useMousePosition
