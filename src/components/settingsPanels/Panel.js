import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Paper, Typography, useTheme,
} from '@mui/material';

function SectionTitle({ children }) {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        position: 'absolute',
        top: '0.25rem',
        left: '0.75rem',
        pr: 0.5,
        background: 'inherit',
        color: theme.palette.secondary.light,
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

function Panel({ label, children }) {
  const theme = useTheme();

  return (
    <Paper elevation={2} sx={{ position: 'relative', p: '0.8rem', mb: 1 }}>
      {label && <SectionTitle>{label}</SectionTitle>}
      <Box sx={{
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: theme.shape.borderRadius,
        pt: 1.5,
        px: 1,
      }}
      >
        {children}
      </Box>
    </Paper>
  );
}

Panel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Panel.defaultProps = {
  label: null,
};

export default Panel;
