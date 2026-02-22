import { Button, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface NavLinkProps {
  label: string
  path: string
  isSelected: boolean
}

function NavLink({ label, path, isSelected }: NavLinkProps): JSX.Element {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Button
      onClick={() => { navigate(path) }}
      sx={{
        color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
        fontWeight: isSelected ? 600 : 500,
        fontSize: '0.875rem',
        px: 2,
        '&:hover': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main
        }
      }}
    >
      {label}
    </Button>
  )
}

export default NavLink
