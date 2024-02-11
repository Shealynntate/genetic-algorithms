import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { GitHub } from '@mui/icons-material'
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack'
import PortraitIcon from '@mui/icons-material/Portrait'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { projectUrl } from '../constants/constants'
import { useLocation, useNavigate } from 'react-router-dom'
import DNAImage from '../assets/DNA.png'
import { useDispatch, useSelector } from 'react-redux'
import { openErrorSnackbar, openSuccessSnackbar, selectIsAuthenticated } from './navigationSlice'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { NavPaths } from './types'

function Header (): JSX.Element {
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
    window.open(projectUrl)
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
    <AppBar position='static' elevation={1} sx={{ p: 0, background: theme.palette.background.paper }}>
      <Container maxWidth='xl'>
        <Toolbar variant='dense' disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction='row' spacing={1}>
            <img src={DNAImage} alt='DNA Helix' width={28} height={28} />
            <Typography variant="h5">Genetic Algorithms</Typography>
          </Stack>
          <Box>
            <Tooltip title='Gallery'>
              <IconButton
                onClick={onGalleryClick}
                size='large'
                color={isSelected(NavPaths.gallery) ? 'primary' : 'default'}
              >
                <PhotoCameraBackIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Your Art'>
              <IconButton
                onClick={onYourArtClick}
                size='large'
                color={isSelected(NavPaths.yourArt) ? 'primary' : 'default'}
              >
                <PortraitIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Experiment'>
              <IconButton
                onClick={onExperimentClick}
                size='large'
                color={isSelected(NavPaths.experiment) ? 'primary' : 'default'}
              >
                <ScienceOutlinedIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            {isAdmin && (
              <IconButton onClick={onAdminClick} size='large'>
                <AdminPanelSettingsIcon fontSize='inherit' />
              </IconButton>
            )}
            <IconButton size='large' onClick={onClickGithub}>
              <GitHub fontSize='inherit' />
            </IconButton>
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
