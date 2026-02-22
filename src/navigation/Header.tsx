import type React from 'react'
import { useState } from 'react'

import { GitHub } from '@mui/icons-material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack'
import PortraitIcon from '@mui/icons-material/Portrait'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import {
  AppBar,
  Box,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  useTheme
} from '@mui/material'
import { signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { NavLabels, NavPaths } from './config'
import HeaderIconButton from './HeaderIconButton'
import HeaderTitle from './HeaderTitle'
import {
  openErrorSnackbar,
  openSuccessSnackbar,
  selectIsAuthenticated
} from './navigationSlice'
import { auth } from '../firebase/firebase'

function Header(): JSX.Element {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const isAdmin = useSelector(selectIsAuthenticated)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isSelected = (path: string): boolean => {
    return pathname === path
  }

  const onClickGithub = (): void => {
    window.open(NavPaths.github, '_blank')
  }

  const onGalleryClick = (): void => {
    navigate(NavPaths.gallery)
  }

  const onExperimentClick = (): void => {
    navigate(NavPaths.experiment)
  }

  const onYourArtClick = (): void => {
    navigate(NavPaths.yourArt)
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
    <AppBar
      position="static"
      elevation={1}
      sx={{ p: 0, background: theme.palette.background.paper }}
    >
      <Container maxWidth="xl">
        <Toolbar
          variant="dense"
          disableGutters
          sx={{ justifyContent: 'space-between' }}
        >
          <HeaderTitle />
          <Box>
            <HeaderIconButton
              label={NavLabels.gallery}
              onClick={onGalleryClick}
              isSelected={isSelected(NavPaths.gallery)}
            >
              <PhotoCameraBackIcon fontSize="inherit" />
            </HeaderIconButton>
            <HeaderIconButton
              label={NavLabels.yourArt}
              onClick={onYourArtClick}
              isSelected={isSelected(NavPaths.yourArt)}
            >
              <PortraitIcon fontSize="inherit" />
            </HeaderIconButton>
            <HeaderIconButton
              label={NavLabels.experiment}
              onClick={onExperimentClick}
              isSelected={isSelected(NavPaths.experiment)}
            >
              <ScienceOutlinedIcon fontSize="inherit" />
            </HeaderIconButton>
            {isAdmin && (
              <HeaderIconButton
                label={NavLabels.admin}
                onClick={onAdminClick}
                isSelected={false}
              >
                <AdminPanelSettingsIcon fontSize="inherit" />
              </HeaderIconButton>
            )}
            <HeaderIconButton
              label={NavLabels.github}
              onClick={onClickGithub}
              isSelected={false}
            >
              <GitHub fontSize="inherit" />
            </HeaderIconButton>
          </Box>
        </Toolbar>
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onAdminMenuClose}
      >
        <MenuItem onClick={onSignOutClick}>Sign Out</MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Header
