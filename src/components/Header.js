import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectUrl } from '../constants/constants';
import ChromosomesIcon from './common/ChromosomesIcon';

function Header() {
  const navigate = useNavigate();

  const onClickGithub = () => {
    window.open(projectUrl);
  };

  const onGalleryClick = () => {
    navigate('/');
  };

  const onExperimentClick = () => {
    navigate('/experiment');
  };

  const onYourArtClick = () => {
    navigate('/your-art');
  };

  const onAboutClick = () => {
    navigate('/about');
  };

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
            <Button onClick={onAboutClick} color="inherit">About</Button>
            <IconButton size="large" onClick={onClickGithub}>
              <GitHub fontSize="inherit" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
