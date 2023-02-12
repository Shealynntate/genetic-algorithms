import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { projectUrl } from '../constants';

function Header() {
  const onClickGithub = () => {
    window.open(projectUrl);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">Genetic Algorithms</Typography>
          <Box>
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
