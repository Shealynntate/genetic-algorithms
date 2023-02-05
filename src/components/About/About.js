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
        <Panel label="Introduction to Genetic Algorithms " px={2} pt={2} pb={2}>
          <Typography color="secondary" sx={{ display: 'inline-block', pr: 1 }}>Metaheuristics</Typography>
          <Typography sx={{ display: 'inline-block' }}>
            - techniques that are useful when you&apos;re facing a problem with three criteria:
          </Typography>
          <Typography sx={{ pl: 2 }}>
            - It&apos;s not obvious how to find a solution to the problem
          </Typography>
          <Typography sx={{ pl: 2 }}>
            - But it&apos;s easy to check if a solution is good or better than another
          </Typography>
          <Typography sx={{ pl: 2 }}>
            - The solution space is so large that simple brute force, trial and error isn&apos;t
            going to work
          </Typography>
          <Typography>
            Metaheuristics are a type of
            <em>stochastic optimization</em>
            , algorithms that use some randomness to find a solution.
          </Typography>
          <br />
          <Typography color="secondary" sx={{ display: 'inline-block', pr: 1 }}>Genetic Algorithms</Typography>
          <Typography sx={{ display: 'inline-block' }}>
            - a subcategory of Metaheuristics that borrow concepts from evolutionary biology.
          </Typography>
          <DialogContentText variant="h5">Goal</DialogContentText>
          <DialogContentText>
            The aim is to match the target image pixel for pixel.
            The program checks each pixel to see how correct it is to the original.
          </DialogContentText>
          <DialogContentText variant="subtitle">Chromosome</DialogContentText>
          <DialogContentText>
            An array of (x, y) coordinates and an rgb color value.
            Each instances forms a single triangle.
          </DialogContentText>
          <DialogContentText variant="subtitle">Organism</DialogContentText>
          <DialogContentText>
            Genome
          </DialogContentText>
        </Panel>
        <Panel label="This Project">
          This site is an interative tool that lets you change parameters for a Genetic Algorithm
          and run that simulation. It lets you watch the top organisms evolve over time and track
          the population&apos;s fitness graphically. Previous runs are also stored for comparison.
          Completed runs also generate a timelapse gif of the process that you can find on the
          Gallery tab,
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
