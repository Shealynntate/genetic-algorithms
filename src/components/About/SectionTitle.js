import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function SectionTitle({ children }) {
  return (
    <Typography
      color="secondary"
      variant="h5"
      sx={{ py: 1 }}
    >
      {children}
    </Typography>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionTitle;
