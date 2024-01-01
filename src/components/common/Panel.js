import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        position: 'absolute',
        top: '0.25rem',
        left: '0.75rem',
        pr: 0.5,
        background: 'inherit',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

function Panel({
  label,
  children,
  variant,
  pt,
  px,
  pb,
}) {
  return (
    <Box
      sx={{
        position: 'relative', p: '0.8rem', mb: 1,
      }}
    >
      {label && <SectionTitle variant={variant}>{label}</SectionTitle>}
      <Box sx={{
        pt,
        px,
        pb,
      }}
      >
        {children}
      </Box>
    </Box>
  );
}

Panel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  pt: PropTypes.number,
  px: PropTypes.number,
  pb: PropTypes.number,
};

Panel.defaultProps = {
  label: null,
  variant: 'primary',
  pt: 1.5,
  px: 1,
  pb: 1,
};

export default Panel;
