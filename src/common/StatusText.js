import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function StatusText({ label, children }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" pr={1}>{`${label}: `}</Typography>
      <Typography variant="caption" fontFamily="'Oxygen Mono', monospace">{children}</Typography>
    </Box>
  );
}

StatusText.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default StatusText;
