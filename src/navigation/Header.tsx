import type React from 'react'
import { useState } from 'react'

import { GitHub } from '@mui/icons-material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import HeaderTitle from './HeaderTitle'
import NavLink from './NavLink'
import {
  openErrorSnackbar,
  openSuccessSnackbar,
  selectIsAuthenticated
} from './navigationSlice'
import { NavLabels, NavPaths } from './config'
import { auth } from '../firebase/firebase'

const navItems: Array<{ label: string; path: string }> = [
  { label: NavLabels.gallery, path: NavPaths.gallery },
  { label: NavLabels.experiment, path: NavPaths.experiment },
  { label: NavLabels.yourArt, path: NavPaths.yourArt }
]

function Header(): JSX.Element {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const isAdmin = useSelector(selectIsAuthenticated)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isSelected = (path: string): boolean => pathname === path

  const onClickGithub = (): void => {
    window.open(NavPaths.github, '_blank')
  }

  const onAdminMenuClose = (): void => {
    setAnchorEl(null)
  }

  const onAdminClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const onSignOutClick = (): void => {
    onAdminMenuClose()
    signOut(auth)
      .then(() => {
        dispatch(openSuccessSnackbar('Signed out successfully'))
      })
      .catch((error) => {
        dispatch(openErrorSnackbar(`Error signing out: ${error.message}`))
        console.error('Error signing out:', error)
      })
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: theme.palette.background.paper }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}
          >
            <HeaderTitle />

            {isMobile ? (
              <IconButton
                onClick={() => { setDrawerOpen(true) }}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                {navItems.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    label={label}
                    path={path}
                    isSelected={isSelected(path)}
                  />
                ))}
                <IconButton
                  size="small"
                  onClick={onClickGithub}
                  sx={{ color: theme.palette.text.secondary, ml: 1 }}
                >
                  <GitHub fontSize="small" />
                </IconButton>
                {isAdmin && (
                  <IconButton
                    size="small"
                    onClick={onAdminClick}
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <AdminPanelSettingsIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            )}
          </Toolbar>
        </Container>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onAdminMenuClose}
        >
          <MenuItem onClick={() => { navigate(NavPaths.admin); onAdminMenuClose() }}>
            Admin Panel
          </MenuItem>
          <MenuItem onClick={onSignOutClick}>Sign Out</MenuItem>
        </Menu>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false) }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navItems.map(({ label, path }) => (
              <ListItemButton
                key={path}
                selected={isSelected(path)}
                onClick={() => {
                  navigate(path)
                  setDrawerOpen(false)
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={() => { onClickGithub(); setDrawerOpen(false) }}>
              <ListItemText primary="GitHub" />
            </ListItemButton>
            {isAdmin && (
              <ListItemButton
                onClick={() => {
                  navigate(NavPaths.admin)
                  setDrawerOpen(false)
                }}
              >
                <ListItemText primary="Admin" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Header
