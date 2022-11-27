import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@mui/material';

function About({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Full credit to Robert Johansson for this project idea. Check it out at
        </DialogContentText>
        <Link
          href="https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/"
          underline="hover"
        >
          Genetic Programming: Evolution of the Mona Lisa
        </Link>
        <DialogContentText variant="h5">Goal</DialogContentText>
        <DialogContentText>
          The aim is to recreate the target image as good as possible.
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
