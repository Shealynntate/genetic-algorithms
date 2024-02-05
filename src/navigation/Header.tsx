import React from 'react'
import {
  AppBar,
  Box,
  Container,
  IconButton,
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
import { projectUrl } from '../constants/constants'
import { useLocation, useNavigate } from 'react-router-dom'
import DNAImage from '../assets/DNA.png'
import { type Page } from './types'

const paths: Record<Page, string> = {
  gallery: '/',
  experiment: '/experiment',
  yourArt: '/your-art'
}

function Header (): JSX.Element {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const theme = useTheme()

  const isSelected = (path: string): boolean => {
    return pathname === path
  }

  const onClickGithub = (): void => {
    window.open(projectUrl)
  }

  const onGalleryClick = (): void => {
    navigate(paths.gallery)
  }

  const onExperimentClick = (): void => {
    navigate(paths.experiment)
  }

  const onYourArtClick = (): void => {
    navigate(paths.yourArt)
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
                color={isSelected(paths.gallery) ? 'primary' : 'default'}
              >
                <PhotoCameraBackIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Experiment'>
              <IconButton
                onClick={onExperimentClick}
                size='large'
                color={isSelected(paths.experiment) ? 'primary' : 'default'}
              >
                <ScienceOutlinedIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Your Art'>
              <IconButton
                onClick={onYourArtClick}
                size='large'
                color={isSelected(paths.yourArt) ? 'primary' : 'default'}
              >
                <PortraitIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <IconButton size='large' onClick={onClickGithub}>
              <GitHub fontSize='inherit' />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
