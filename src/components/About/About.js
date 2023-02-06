import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';
import Panel from '../settingsPanels/Panel';
import ResourcesPanel from './ResourcesPanel';
import OverviewPanel from './OverviewPanel';
import AlgorithmPanel from './AlgorithmPanel';

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
        <Panel label="This Project">
          This site is an interative tool that lets you change parameters for a Genetic Algorithm
          and run that simulation. It lets you watch the top organisms evolve over time and track
          the population&apos;s fitness graphically. Previous runs are also stored for comparison.
          Completed runs also generate a timelapse gif of the process that you can find on the
          Gallery tab,
          <DialogContentText variant="h5">Goal</DialogContentText>
          <DialogContentText>
            The aim is to match the target image pixel for pixel.
            The program checks each pixel to see how correct it is to the original.
          </DialogContentText>
        </Panel>
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
