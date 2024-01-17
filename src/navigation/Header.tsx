import React from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import { GitHub } from '@mui/icons-material'
import { projectUrl } from '../constants/constants'
import { useNavigate } from 'react-router-dom'
import ChromosomesIcon from '../common/ChromosomesIcon'

function Header (): JSX.Element {
  const navigate = useNavigate()

  const onClickGithub = (): void => {
    window.open(projectUrl)
  }

  const onGalleryClick = (): void => {
    navigate('/')
  }

  const onExperimentClick = (): void => {
    navigate('/experiment')
  }

  const onYourArtClick = (): void => {
    navigate('/your-art')
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={0}>
            <ChromosomesIcon sx={{ width: 48, height: 48 }} />
            <Typography variant="h4">Genetic Algorithms</Typography>
          </Stack>
          <Box>
            <Button onClick={onGalleryClick} color="inherit">Gallery</Button>
            <Button onClick={onExperimentClick} color="inherit">Experiment</Button>
            <Button onClick={onYourArtClick} color="inherit">Your Art</Button>
            <IconButton size="large" onClick={onClickGithub}>
              <GitHub fontSize="inherit" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
