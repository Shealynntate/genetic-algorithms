import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';
import ResourcesPanel from './ResourcesPanel';
import OverviewPanel from './OverviewPanel';
import AlgorithmPanel from './AlgorithmPanel';
import ProjectPanel from './ProjectPanel';

function About({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle sx={{ pb: 1 }}>About</DialogTitle>
      <DialogContent>
        <Typography color="GrayText" sx={{ display: 'inline-block', pr: 1, pb: 1 }}>
          Full credit to Robert Johansson for this project idea. Check it out at
        </Typography>
        <Link
          href="https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/"
          underline="hover"
          sx={{ display: 'inline-block' }}
        >
          Genetic Programming: Evolution of the Mona Lisa
        </Link>
        <OverviewPanel />
        <AlgorithmPanel />
        <ProjectPanel />
        <ResourcesPanel />
      </DialogContent>
    </Dialog>
  );
}

About.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

About.defaultProps = {
  open: false,
  onClose: () => {},
};

export default About;
