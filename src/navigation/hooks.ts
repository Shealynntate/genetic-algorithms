import { useLayoutEffect, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import { type MousePosition, type AppState } from './types'
import { MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT, RunningStates } from './config'

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

/**
 * A custom hook that returns the dimensions of the window and updates when the window is resized.
 * @returns {Array} An array of the form [width, height]
 */
export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([MIN_BROWSER_WIDTH, MIN_BROWSER_HEIGHT])

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()

    return () => { window.removeEventListener('resize', updateSize) }
  }, [])

  return size
}
