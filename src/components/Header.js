import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { projectUrl } from '../constants';
import ChromosomesIcon from './ChromosomesIcon';

function Header() {
  const onClickGithub = () => {
    window.open(projectUrl);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ChromosomesIcon sx={{ width: 48, height: 48 }} />
            <Typography variant="h4">Genetic Algorithms</Typography>
          </Stack>
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
