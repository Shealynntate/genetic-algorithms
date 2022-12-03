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
import DeveloperMenu from './development/DeveloperMenu';

// TODO: Add "Save Gallery" download button - make it social media friendly!! (think Wordle)

const isDevelopment = process.env.NODE_ENV === 'development';

function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">Genetic Algorithms</Typography>
          <Box>
            {isDevelopment && <Button onClick={() => setDevOpen(true)}>Developer</Button>}
            <Button onClick={() => setAboutOpen(true)}>Gallery</Button>
            <Button onClick={() => setAboutOpen(true)}>About</Button>
            <IconButton>
              <GitHub />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <DeveloperMenu open={devOpen} onClose={() => setDevOpen(false)} />
    </AppBar>
  );
}

export default Header;
