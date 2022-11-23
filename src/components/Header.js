import React from 'react';
import {
  AppBar, Box, Button, IconButton, Toolbar, Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { Container } from '@mui/system';

function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">Genetic Algorithms</Typography>
          <Box>
            <Button>About</Button>
            <IconButton>
              <GitHub />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
