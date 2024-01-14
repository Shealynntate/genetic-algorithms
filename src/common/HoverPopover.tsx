import React, { useEffect, useRef } from 'react'
import { Popover } from '@mui/material'
import { Box } from '@mui/system'
import useMousePosition from '../simulation/useMousePosition'

const buffer = [3 * 16, 16]

interface HoverPopoverProps {
  open?: boolean
  children: React.ReactNode
  anchorEl?: Element | null
  onClose?: () => void
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

function HoverPopover ({
  open = false,
  children,
  anchorEl = null,
  onClose = () => {},
  anchorOrigin = { vertical: 'center', horizontal: 'right' },
  transformOrigin = { vertical: 'center', horizontal: 'left' }
}: HoverPopoverProps): JSX.Element {
  const mousePosition = useMousePosition()
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (ref.current == null) return

    const b = buffer
    const { x, y } = mousePosition
    const { top, left, right, bottom } = ref.current?.getBoundingClientRect()
    // If inside the anchor plus a small buffer around the rect, don't close
    if (x > left - b[0] && x < right + b[0] && y > top - b[1] && y < bottom + b[1]) {
      return
    }

    onClose()
  }, [mousePosition])

  return (
    <Popover
      sx={{ p: 0 }}
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box sx={{ p: 1 }} ref={ref}>
        {children}
      </Box>
    </Popover>
  )
}

export default HoverPopover
