import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';
import data from '../assets/test-data.json';

function Gallery({ open, onClose }) {
  console.log(data);
  return (
    <Dialog open={open} onClose={onClose}>
      Gallery Here
      <p>{data}</p>
    </Dialog>
  );
}

Gallery.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

Gallery.defaultProps = {
  open: false,
  onClose: () => {},
};

export default Gallery;
