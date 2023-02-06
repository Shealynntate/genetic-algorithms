import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function ExampleText({ children }) {
  return (
    <Typography color="primary">{children}</Typography>
  );
}

ExampleText.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExampleText;
