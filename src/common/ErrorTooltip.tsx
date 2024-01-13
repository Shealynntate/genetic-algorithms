import React from 'react'
import styled from '@emotion/styled'
import { Box } from '@mui/material'
import theme from '../theme'

interface ErrorTooltipProps {
  children: JSX.Element
  direction?: string
  display?: string
  error?: string
  show?: boolean
}

const ErrorTooltip = styled(({
  error,
  children,
  direction = 'bottom',
  display = 'block',
  show = false
}: ErrorTooltipProps): JSX.Element => {
  if (error == null) {
    // Don't create the tooltip if there's no text content
    return children
  }

  return (
    <Box
      style={{ display: 'inherit', position: 'relative' }}
    >
      {children}
      {show && (
        <div
          className={`Tooltip-Tip ${direction}`}
          style={{
            display,
            position: 'absolute',
            lineHeight: 1.3,
            zIndex: 9999,
            whiteSpace: 'pre',
            overflowX: 'visible',
            color: theme.palette.error.light,
            background: theme.palette.background.paper
          }}
        >
          {error}
        </div>
      )}
    </Box>
  )
})()

export default ErrorTooltip
