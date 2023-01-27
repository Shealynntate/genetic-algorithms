import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import About from './About';

function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">Genetic Algorithms</Typography>
          <Box>
            <Button onClick={() => setAboutOpen(true)}>About</Button>
            <IconButton>
              <GitHub />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </AppBar>
  );
}

export default Header;
