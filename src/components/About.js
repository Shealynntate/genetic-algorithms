import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  List,
  ListItem,
} from '@mui/material';

function About({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ display: 'inline-block', pr: 1 }}>
          Full credit to Robert Johansson for this project idea. Check it out at
        </DialogContentText>
        <Link
          href="https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/"
          underline="hover"
          sx={{ display: 'inline-block' }}
        >
          Genetic Programming: Evolution of the Mona Lisa
        </Link>
        <DialogContentText variant="h5">Goal</DialogContentText>
        <DialogContentText>
          The aim is to match the target image pixel for pixel.
          The program checks each pixel to see how correct it is to the original.
        </DialogContentText>
        <DialogContentText variant="subtitle">DNA</DialogContentText>
        <DialogContentText>
          An array of (x, y) coordinates and an rgb color value.
          Each instances forms a single triangle.
        </DialogContentText>
        <DialogContentText variant="subtitle">Organism</DialogContentText>
        <DialogContentText>
          Genome
        </DialogContentText>
        <DialogContentText variant="h5">Resources</DialogContentText>
        Here&apos;s a list of resources I used while working on this project
        <List>
          <ListItem>
            <Link
              href="https://cs.gmu.edu/~sean/book/metaheuristics/Essentials.pdf"
              underline="hover"
            >
              Essentials of Metaheuristics
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="https://www.egr.msu.edu/~kdeb/papers/k2012016.pdf"
              underline="hover"
            >
              Analyzing Mutation Schemes for Real-Parameter Genetic Algorithms
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="https://pdfs.semanticscholar.org/5a25/a4d30528160eef96adbce1d7b03507ebd3d7.pdf"
              underline="hover"
            >
              Choosing Mutation and Crossover Ratios for Genetic Algorithms
            </Link>
          </ListItem>
        </List>
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
