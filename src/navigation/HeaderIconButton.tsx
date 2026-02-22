import type React from 'react'

import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material'

interface HeaderIconButtonProps {
  children: React.ReactNode
  isSelected: boolean
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function HeaderIconButton({
  children,
  isSelected,
  label,
  onClick
}: HeaderIconButtonProps): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Tooltip title={label}>
      <IconButton
        size={isMobile ? 'medium' : 'large'}
        color={isSelected ? 'primary' : 'default'}
        onClick={onClick}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default HeaderIconButton
